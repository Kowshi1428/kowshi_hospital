// Centralized mock data for Kowshi Hospitals frontend demo.
// No backend / API calls — everything here is static, in-memory data.

export const hospital = {
  name: 'Kowshi Hospitals',
  tagline: 'Care Operations Platform',
  campus: 'Anna Nagar Campus · Chennai',
}

export const departments = [
  { name: 'Cardiology', patients: 128, color: '#3e6bfa' },
  { name: 'Neurology', patients: 84, color: '#22d3ee' },
  { name: 'Orthopedics', patients: 96, color: '#34d399' },
  { name: 'Pediatrics', patients: 142, color: '#fbbf24' },
  { name: 'Oncology', patients: 61, color: '#f87171' },
  { name: 'General Medicine', patients: 173, color: '#a78bfa' },
]

export const admissionsTrend = [
  { month: 'Jan', admissions: 210, discharges: 198 },
  { month: 'Feb', admissions: 232, discharges: 220 },
  { month: 'Mar', admissions: 198, discharges: 205 },
  { month: 'Apr', admissions: 260, discharges: 240 },
  { month: 'May', admissions: 284, discharges: 265 },
  { month: 'Jun', admissions: 251, discharges: 258 },
  { month: 'Jul', admissions: 298, discharges: 270 },
]

export const revenueTrend = [
  { month: 'Jan', revenue: 412000, expenses: 298000 },
  { month: 'Feb', revenue: 438000, expenses: 305000 },
  { month: 'Mar', revenue: 401000, expenses: 292000 },
  { month: 'Apr', revenue: 465000, expenses: 318000 },
  { month: 'May', revenue: 512000, expenses: 334000 },
  { month: 'Jun', revenue: 489000, expenses: 327000 },
  { month: 'Jul', revenue: 541000, expenses: 341000 },
]

export const bedOccupancy = [
  { ward: 'ICU', total: 24, occupied: 21 },
  { ward: 'General', total: 160, occupied: 118 },
  { ward: 'Pediatric', total: 40, occupied: 22 },
  { ward: 'Maternity', total: 32, occupied: 19 },
  { ward: 'Emergency', total: 20, occupied: 14 },
  { ward: 'Isolation', total: 16, occupied: 5 },
]

export const vitalsPulse = [4, 7, 5, 9, 6, 12, 8, 14, 9, 16, 10, 18, 12, 20, 13, 22, 15, 24, 16, 26]

export const patients = [
  { id: 'MRN-84213', name: 'Arjun Menon', age: 54, gender: 'Male', department: 'Cardiology', doctor: 'Dr. Priya Raman', status: 'Admitted', room: 'ICU-04', admitted: '2026-07-14', condition: 'Stable', phone: '+91 98400 12345' },
  { id: 'MRN-84220', name: 'Lakshmi Narayanan', age: 32, gender: 'Female', department: 'Maternity', doctor: 'Dr. Kavitha Suresh', status: 'Admitted', room: 'MAT-11', admitted: '2026-07-17', condition: 'Stable', phone: '+91 98400 22345' },
  { id: 'MRN-84231', name: 'Rohit Sharma', age: 8, gender: 'Male', department: 'Pediatrics', doctor: 'Dr. Anand Verma', status: 'Outpatient', room: '—', admitted: '2026-07-18', condition: 'Recovering', phone: '+91 98400 32345' },
  { id: 'MRN-84245', name: 'Fatima Sheikh', age: 67, gender: 'Female', department: 'Oncology', doctor: 'Dr. Rajesh Iyer', status: 'Admitted', room: 'ONC-02', admitted: '2026-07-10', condition: 'Critical', phone: '+91 98400 42345' },
  { id: 'MRN-84256', name: 'Vikram Aditya', age: 45, gender: 'Male', department: 'Orthopedics', doctor: 'Dr. Neha Kapoor', status: 'Discharged', room: '—', admitted: '2026-07-05', condition: 'Recovered', phone: '+91 98400 52345' },
  { id: 'MRN-84267', name: 'Meera Pillai', age: 29, gender: 'Female', department: 'Neurology', doctor: 'Dr. Suresh Babu', status: 'Admitted', room: 'NEU-07', admitted: '2026-07-16', condition: 'Stable', phone: '+91 98400 62345' },
  { id: 'MRN-84278', name: 'Karthik Subramaniam', age: 61, gender: 'Male', department: 'Cardiology', doctor: 'Dr. Priya Raman', status: 'Admitted', room: 'ICU-08', admitted: '2026-07-15', condition: 'Critical', phone: '+91 98400 72345' },
  { id: 'MRN-84289', name: 'Ananya Reddy', age: 4, gender: 'Female', department: 'Pediatrics', doctor: 'Dr. Anand Verma', status: 'Outpatient', room: '—', admitted: '2026-07-19', condition: 'Stable', phone: '+91 98400 82345' },
  { id: 'MRN-84291', name: 'Suresh Gopalan', age: 73, gender: 'Male', department: 'General Medicine', doctor: 'Dr. Divya Krishnan', status: 'Admitted', room: 'GEN-14', admitted: '2026-07-12', condition: 'Stable', phone: '+91 98400 92345' },
  { id: 'MRN-84302', name: 'Divya Bhaskar', age: 38, gender: 'Female', department: 'Orthopedics', doctor: 'Dr. Neha Kapoor', status: 'Discharged', room: '—', admitted: '2026-07-08', condition: 'Recovered', phone: '+91 98400 02345' },
  { id: 'MRN-84318', name: 'Manoj Tiwari', age: 51, gender: 'Male', department: 'Oncology', doctor: 'Dr. Rajesh Iyer', status: 'Admitted', room: 'ONC-05', admitted: '2026-07-13', condition: 'Stable', phone: '+91 98400 13345' },
  { id: 'MRN-84327', name: 'Priyanka Das', age: 26, gender: 'Female', department: 'General Medicine', doctor: 'Dr. Divya Krishnan', status: 'Outpatient', room: '—', admitted: '2026-07-19', condition: 'Stable', phone: '+91 98400 23345' },
]

export const doctors = [
  { id: 'DOC-101', name: 'Dr. Priya Raman', specialty: 'Cardiology', experience: 14, patients: 42, rating: 4.9, status: 'On Duty', shift: '08:00 – 18:00', phone: '+91 98450 10101' },
  { id: 'DOC-102', name: 'Dr. Kavitha Suresh', specialty: 'Obstetrics & Gynecology', experience: 11, patients: 36, rating: 4.8, status: 'On Duty', shift: '09:00 – 17:00', phone: '+91 98450 10102' },
  { id: 'DOC-103', name: 'Dr. Anand Verma', specialty: 'Pediatrics', experience: 9, patients: 58, rating: 4.9, status: 'On Duty', shift: '08:00 – 16:00', phone: '+91 98450 10103' },
  { id: 'DOC-104', name: 'Dr. Rajesh Iyer', specialty: 'Oncology', experience: 18, patients: 27, rating: 4.7, status: 'Off Duty', shift: '10:00 – 20:00', phone: '+91 98450 10104' },
  { id: 'DOC-105', name: 'Dr. Neha Kapoor', specialty: 'Orthopedics', experience: 8, patients: 44, rating: 4.6, status: 'On Duty', shift: '08:00 – 18:00', phone: '+91 98450 10105' },
  { id: 'DOC-106', name: 'Dr. Suresh Babu', specialty: 'Neurology', experience: 16, patients: 31, rating: 4.8, status: 'On Leave', shift: '—', phone: '+91 98450 10106' },
  { id: 'DOC-107', name: 'Dr. Divya Krishnan', specialty: 'General Medicine', experience: 7, patients: 62, rating: 4.5, status: 'On Duty', shift: '07:00 – 15:00', phone: '+91 98450 10107' },
  { id: 'DOC-108', name: 'Dr. Karthik Nair', specialty: 'Emergency Medicine', experience: 12, patients: 38, rating: 4.7, status: 'On Duty', shift: '00:00 – 08:00', phone: '+91 98450 10108' },
]

export const appointments = [
  { id: 'APT-5501', patient: 'Arjun Menon', doctor: 'Dr. Priya Raman', department: 'Cardiology', date: '2026-07-20', time: '09:30 AM', type: 'Follow-up', status: 'Confirmed' },
  { id: 'APT-5502', patient: 'Rohit Sharma', doctor: 'Dr. Anand Verma', department: 'Pediatrics', date: '2026-07-20', time: '10:00 AM', type: 'Consultation', status: 'Confirmed' },
  { id: 'APT-5503', patient: 'Meera Pillai', doctor: 'Dr. Suresh Babu', department: 'Neurology', date: '2026-07-20', time: '11:15 AM', type: 'Follow-up', status: 'Pending' },
  { id: 'APT-5504', patient: 'Ananya Reddy', doctor: 'Dr. Anand Verma', department: 'Pediatrics', date: '2026-07-20', time: '12:00 PM', type: 'Vaccination', status: 'Confirmed' },
  { id: 'APT-5505', patient: 'Suresh Gopalan', doctor: 'Dr. Divya Krishnan', department: 'General Medicine', date: '2026-07-20', time: '02:30 PM', type: 'Consultation', status: 'Confirmed' },
  { id: 'APT-5506', patient: 'Priyanka Das', doctor: 'Dr. Divya Krishnan', department: 'General Medicine', date: '2026-07-20', time: '03:00 PM', type: 'Lab Review', status: 'Cancelled' },
  { id: 'APT-5507', patient: 'Manoj Tiwari', doctor: 'Dr. Rajesh Iyer', department: 'Oncology', date: '2026-07-21', time: '09:00 AM', type: 'Chemotherapy', status: 'Confirmed' },
  { id: 'APT-5508', patient: 'Divya Bhaskar', doctor: 'Dr. Neha Kapoor', department: 'Orthopedics', date: '2026-07-21', time: '10:45 AM', type: 'Follow-up', status: 'Pending' },
]

export const pharmacyInventory = [
  { id: 'RX-2201', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 1240, reorderLevel: 400, unit: 'Capsules', expiry: '2027-03-01', status: 'In Stock' },
  { id: 'RX-2202', name: 'Paracetamol 650mg', category: 'Analgesic', stock: 320, reorderLevel: 500, unit: 'Tablets', expiry: '2027-01-15', status: 'Low Stock' },
  { id: 'RX-2203', name: 'Atorvastatin 20mg', category: 'Statin', stock: 890, reorderLevel: 300, unit: 'Tablets', expiry: '2026-11-20', status: 'In Stock' },
  { id: 'RX-2204', name: 'Insulin Glargine', category: 'Hormone', stock: 64, reorderLevel: 80, unit: 'Vials', expiry: '2026-09-10', status: 'Low Stock' },
  { id: 'RX-2205', name: 'Metformin 500mg', category: 'Antidiabetic', stock: 1560, reorderLevel: 400, unit: 'Tablets', expiry: '2027-06-05', status: 'In Stock' },
  { id: 'RX-2206', name: 'Salbutamol Inhaler', category: 'Bronchodilator', stock: 18, reorderLevel: 50, unit: 'Units', expiry: '2026-08-30', status: 'Critical' },
  { id: 'RX-2207', name: 'Omeprazole 20mg', category: 'PPI', stock: 720, reorderLevel: 250, unit: 'Capsules', expiry: '2027-02-18', status: 'In Stock' },
  { id: 'RX-2208', name: 'Ceftriaxone 1g', category: 'Antibiotic', stock: 42, reorderLevel: 100, unit: 'Vials', expiry: '2026-10-12', status: 'Critical' },
]

export const invoices = [
  { id: 'INV-9001', patient: 'Arjun Menon', department: 'Cardiology', amount: 84500, status: 'Paid', date: '2026-07-15', method: 'Insurance' },
  { id: 'INV-9002', patient: 'Fatima Sheikh', department: 'Oncology', amount: 212000, status: 'Pending', date: '2026-07-16', method: 'Insurance' },
  { id: 'INV-9003', patient: 'Rohit Sharma', department: 'Pediatrics', amount: 6400, status: 'Paid', date: '2026-07-18', method: 'Card' },
  { id: 'INV-9004', patient: 'Vikram Aditya', department: 'Orthopedics', amount: 138000, status: 'Paid', date: '2026-07-06', method: 'Cash' },
  { id: 'INV-9005', patient: 'Karthik Subramaniam', department: 'Cardiology', amount: 96500, status: 'Overdue', date: '2026-07-11', method: 'Insurance' },
  { id: 'INV-9006', patient: 'Meera Pillai', department: 'Neurology', amount: 45200, status: 'Pending', date: '2026-07-17', method: 'Card' },
  { id: 'INV-9007', patient: 'Suresh Gopalan', department: 'General Medicine', amount: 18300, status: 'Paid', date: '2026-07-13', method: 'Cash' },
  { id: 'INV-9008', patient: 'Manoj Tiwari', department: 'Oncology', amount: 175000, status: 'Pending', date: '2026-07-14', method: 'Insurance' },
]

export const labTests = [
  { id: 'LAB-3301', patient: 'Fatima Sheikh', test: 'Complete Blood Count', orderedBy: 'Dr. Rajesh Iyer', status: 'Completed', priority: 'Urgent', date: '2026-07-19' },
  { id: 'LAB-3302', patient: 'Karthik Subramaniam', test: 'Cardiac Enzyme Panel', orderedBy: 'Dr. Priya Raman', status: 'In Progress', priority: 'Urgent', date: '2026-07-20' },
  { id: 'LAB-3303', patient: 'Meera Pillai', test: 'MRI Brain', orderedBy: 'Dr. Suresh Babu', status: 'Scheduled', priority: 'Routine', date: '2026-07-21' },
  { id: 'LAB-3304', patient: 'Suresh Gopalan', test: 'Lipid Profile', orderedBy: 'Dr. Divya Krishnan', status: 'Completed', priority: 'Routine', date: '2026-07-18' },
  { id: 'LAB-3305', patient: 'Lakshmi Narayanan', test: 'Ultrasound — Obstetric', orderedBy: 'Dr. Kavitha Suresh', status: 'Completed', priority: 'Routine', date: '2026-07-17' },
  { id: 'LAB-3306', patient: 'Rohit Sharma', test: 'Blood Glucose', orderedBy: 'Dr. Anand Verma', status: 'In Progress', priority: 'Routine', date: '2026-07-20' },
]

export const activityFeed = [
  { id: 1, actor: 'Dr. Priya Raman', action: 'admitted patient Karthik Subramaniam to ICU-08', time: '8 min ago', type: 'admission' },
  { id: 2, actor: 'Pharmacy', action: 'flagged Salbutamol Inhaler as critical low stock', time: '24 min ago', type: 'inventory' },
  { id: 3, actor: 'Lab · Radiology', action: 'completed CBC results for Fatima Sheikh', time: '41 min ago', type: 'lab' },
  { id: 4, actor: 'Billing', action: 'generated invoice INV-9008 for Manoj Tiwari', time: '1 hr ago', type: 'billing' },
  { id: 5, actor: 'Dr. Anand Verma', action: 'discharged patient after outpatient consultation', time: '2 hr ago', type: 'discharge' },
  { id: 6, actor: 'Front Desk', action: 'scheduled 4 new appointments for tomorrow', time: '3 hr ago', type: 'appointment' },
]

export const staffOnDuty = {
  doctors: 34,
  nurses: 96,
  support: 41,
}

export const kpis = {
  totalPatients: 1284,
  admittedToday: 27,
  bedOccupancyRate: 74,
  avgWaitTime: 18,
  revenueThisMonth: 541000,
  revenueChange: 10.6,
  criticalAlerts: 4,
}
