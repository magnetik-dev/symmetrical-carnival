import { createSupabaseClient } from './supabase';

// Define the interface for the cached data
export interface StudentRecord {
    student_number: string;
    name: string;
    profile: string | null;
    batch_name: string | null;
    lead_name: string | null;
}

export interface RegistryStats {
    studentsCount: number;
    batchesCount: number;
    programsCount: number;
    leadsCount: number;
}

class RegistryCache {
    // Reactive state runes
    students = $state<StudentRecord[]>([]);
    stats = $state<RegistryStats>({
        studentsCount: 0,
        batchesCount: 0,
        programsCount: 0,
        leadsCount: 0
    });
    isLoaded = $state(false);
    isLoading = $state(false);
    error = $state<string | null>(null);

    constructor() {
        // Initialize from sessionStorage if in browser environment
        if (typeof window !== 'undefined') {
            try {
                const cached = sessionStorage.getItem('registry_cache');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (parsed.students && parsed.stats) {
                        this.students = parsed.students;
                        this.stats = parsed.stats;
                        this.isLoaded = true;
                    }
                }
            } catch (e) {
                console.error('Failed to load registry cache from sessionStorage:', e);
            }
        }
    }

    /**
     * Loads the registry data.
     * @param force If true, bypasses cache and fetches fresh data from the backend.
     */
    async loadData(force = false) {
        // If already loaded and not forcing a refresh, return cached data immediately
        if (this.isLoaded && !force) {
            return { students: this.students, stats: this.stats };
        }

        this.isLoading = true;
        this.error = null;

        try {
            const supabase = createSupabaseClient();

            // Fetch statistics and students in parallel
            const [studentsRes, batchesRes, programsRes, leadsRes, studentsQuery] = await Promise.all([
                supabase.from('students').select('*', { count: 'exact', head: true }),
                supabase.from('batch').select('*', { count: 'exact', head: true }),
                supabase.from('programs').select('*', { count: 'exact', head: true }),
                supabase.from('leads').select('*', { count: 'exact', head: true }),
                supabase.from('students').select(`
                    student_number,
                    name,
                    profile,
                    batch (
                        batch_name
                    ),
                    leads (
                        lead_name
                    )
                `)
            ]);

            if (studentsQuery.error) throw studentsQuery.error;

            // Flat-map relational data
            const formattedStudents: StudentRecord[] = (studentsQuery.data || []).map((student: any) => {
                let batch_name = null;
                if (student.batch) {
                    if (Array.isArray(student.batch)) {
                        batch_name = student.batch[0]?.batch_name || null;
                    } else {
                        batch_name = (student.batch as any).batch_name || null;
                    }
                }

                let lead_name = null;
                if (student.leads) {
                    if (Array.isArray(student.leads)) {
                        lead_name = student.leads[0]?.lead_name || null;
                    } else {
                        lead_name = (student.leads as any).lead_name || null;
                    }
                }

                return {
                    student_number: student.student_number,
                    name: student.name,
                    profile: student.profile,
                    batch_name,
                    lead_name
                };
            });

            // Update reactive state
            this.students = formattedStudents;
            this.stats = {
                studentsCount: studentsRes.count ?? 0,
                batchesCount: batchesRes.count ?? 0,
                programsCount: programsRes.count ?? 0,
                leadsCount: leadsRes.count ?? 0
            };
            this.isLoaded = true;

            // Persist to sessionStorage for hard refresh caching
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('registry_cache', JSON.stringify({
                    students: this.students,
                    stats: this.stats
                }));
            }
        } catch (err: any) {
            console.error('Error loading registry data:', err);
            this.error = err.message || 'An error occurred while fetching data';
        } finally {
            this.isLoading = false;
        }

        return { students: this.students, stats: this.stats };
    }

    /**
     * Clears the cache.
     */
    clear() {
        this.students = [];
        this.stats = {
            studentsCount: 0,
            batchesCount: 0,
            programsCount: 0,
            leadsCount: 0
        };
        this.isLoaded = false;
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('registry_cache');
        }
    }
}

export const registryCache = new RegistryCache();
