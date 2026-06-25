import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Fetch counts for the stats level
    const [studentsRes, batchesRes, programsRes, leadsRes] = await Promise.all([
        locals.supabase.from('students').select('*', { count: 'exact', head: true }),
        locals.supabase.from('batch').select('*', { count: 'exact', head: true }),
        locals.supabase.from('programs').select('*', { count: 'exact', head: true }),
        locals.supabase.from('leads').select('*', { count: 'exact', head: true })
    ]);

    // Fetch student information with references
    // We need student_number, name, profile, batch_name using batch_id, lead_name using refered_by
    const { data: students, error: studentsError } = await locals.supabase
        .from('students')
        .select(`
            student_number,
            name,
            profile,
            batch (
                batch_name
            ),
            leads (
                lead_name
            )
        `);

    if (studentsError) {
        console.error('Error fetching students:', studentsError);
    }

    // Format the student records into a flat structure on the server
    const formattedStudents = (students || []).map((student: any) => {
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

    return {
        stats: {
            studentsCount: studentsRes.count ?? 0,
            batchesCount: batchesRes.count ?? 0,
            programsCount: programsRes.count ?? 0,
            leadsCount: leadsRes.count ?? 0
        },
        students: formattedStudents
    };
};
