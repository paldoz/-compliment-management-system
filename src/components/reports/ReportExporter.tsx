"use client"

import { useState } from "react"
import { Download, FileText, FileSpreadsheet, Loader2, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface ComplaintExport {
    id: string
    title: string
    status: string
    organization: string
    department: string
    resolvedBy: string
    createdAt: string
    updatedAt: string
}

interface DepartmentExport {
    id: string
    name: string
    organization: string
    totalComplaints: number
    unresolvedCount: number
    resolvedCount: number
    avgResolutionTime: number
}

interface ExportData {
    complaints: ComplaintExport[]
    summary: {
        totalComplaints: number
        statusCounts: {
            PENDING: number
            APPROVED: number
            RESOLVED: number
            REJECTED: number
        }
    }
    departmentStats: DepartmentExport[]
}

export function ReportExporter({ data }: { data: ExportData }) {
    const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const logExport = async (type: string) => {
        try {
            await fetch('/api/super-admin/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exportType: type })
            })
        } catch (e) {
            console.error('Failed to log export', e)
        }
    }

    const triggerDownload = (blob: Blob, filename: string) => {
        try {
            const url = URL.createObjectURL(blob);
            const link = document.body.appendChild(document.createElement('a'));
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            link.click();

            // Clean up with a small delay to ensure download starts
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (err) {
            console.error('Download trigger failed:', err);
            throw new Error('Browser blocked the download or initialization failed.');
        }
    }

    const exportToPDF = async () => {
        setExporting('pdf')
        setError(null)
        setSuccess(null)

        try {
            // Create document
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            // Title
            doc.setFontSize(22)
            doc.setTextColor(30, 41, 59)
            doc.text('CMS PERFORMANCE REPORT', 14, 22)

            // Meta
            doc.setFontSize(10)
            doc.setTextColor(100, 116, 139)
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30)
            doc.text(`Organization: Global Registry`, 14, 35)

            // Line
            doc.setDrawColor(226, 232, 240)
            doc.line(14, 40, 196, 40)

            // Summary Stats
            doc.setFontSize(14)
            doc.setTextColor(30, 41, 59)
            doc.text('Summary Statistics', 14, 52)

            const summaryData = [
                ['Metric', 'Count'],
                ['Total Complaints', data.summary.totalComplaints.toString()],
                ['Pending', data.summary.statusCounts.PENDING.toString()],
                ['Approved/In Progress', data.summary.statusCounts.APPROVED.toString()],
                ['Resolved/Closed', data.summary.statusCounts.RESOLVED.toString()],
                ['Rejected', data.summary.statusCounts.REJECTED.toString()]
            ]

            autoTable(doc, {
                startY: 58,
                head: [summaryData[0]],
                body: summaryData.slice(1),
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                margin: { left: 14, right: 14 }
            })

            // Department Stats Table
            const deptY = (doc as any).lastAutoTable?.finalY || 100
            doc.setFontSize(14)
            doc.text('Departmental Performance', 14, deptY + 15)

            const departmentsData = data.departmentStats.map(d => [
                d.name,
                d.organization,
                d.totalComplaints.toString(),
                d.unresolvedCount.toString(),
                d.resolvedCount.toString(),
                `${d.avgResolutionTime}h`
            ])

            if (departmentsData.length > 0) {
                autoTable(doc, {
                    startY: deptY + 20,
                    head: [['Department', 'Organization', 'Total', 'Unresolved', 'Resolved', 'Avg Resol. Time']],
                    body: departmentsData,
                    theme: 'grid',
                    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
                    styles: { fontSize: 8 },
                    margin: { left: 14, right: 14 }
                })
            }

            // Complaints Table
            const finalY = (doc as any).lastAutoTable?.finalY || 150
            doc.setFontSize(14)
            doc.text('Complaints Detail (Top 200)', 14, finalY + 15)

            const complaintsData = data.complaints.slice(0, 200).map(c => [
                c.id.substring(0, 8).toUpperCase(),
                c.title,
                c.status,
                c.organization,
                c.department,
                new Date(c.createdAt).toLocaleDateString()
            ])

            if (complaintsData.length > 0) {
                autoTable(doc, {
                    startY: finalY + 20,
                    head: [['ID', 'Title', 'Status', 'Org', 'Dept', 'Date']],
                    body: complaintsData,
                    theme: 'striped',
                    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
                    styles: { fontSize: 8, cellPadding: 2 },
                    columnStyles: {
                        0: { cellWidth: 20 },
                        1: { cellWidth: 'auto' },
                        2: { cellWidth: 25 },
                        5: { cellWidth: 25 }
                    },
                    margin: { left: 14, right: 14 }
                })
            }

            // Footer
            const pageCount = doc.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.setFontSize(9)
                doc.setTextColor(148, 163, 184)
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 10,
                    { align: 'center' }
                )
            }

            const filename = `Report_${new Date().getTime()}.pdf`

            // Generate Blob and trigger download
            const blob = doc.output('blob')
            triggerDownload(blob, filename)

            await logExport('PDF')
            setSuccess(`PDF Downloaded: ${filename}`)
        } catch (err) {
            console.error('PDF export failed:', err)
            setError(`Failed to export PDF: ${err instanceof Error ? err.message : 'Unknown error'}`)
        } finally {
            setExporting(null)
        }
    }

    const exportToExcel = async () => {
        setExporting('excel')
        setError(null)
        setSuccess(null)

        try {
            const XLSX = await import('xlsx')

            // Summary sheet data
            const summaryRows = [
                ['CMS PERFORMANCE REPORT'],
                [`Generated on: ${new Date().toLocaleString()}`],
                [],
                ['SUMMARY STATISTICS'],
                ['Metric', 'Count'],
                ['Total Complaints', data.summary.totalComplaints],
                ['Pending', data.summary.statusCounts.PENDING],
                ['Approved/In Progress', data.summary.statusCounts.APPROVED],
                ['Resolved/Closed', data.summary.statusCounts.RESOLVED],
                ['Rejected', data.summary.statusCounts.REJECTED]
            ]
            const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows)

            // Complaints sheet data
            const complaintsData = data.complaints.map(c => ({
                'ID': c.id,
                'Title': c.title,
                'Status': c.status,
                'Organization': c.organization,
                'Department': c.department,
                'Resolved By': c.resolvedBy || 'Unresolved',
                'Created At': new Date(c.createdAt).toLocaleString(),
            }))
            const complaintsSheet = XLSX.utils.json_to_sheet(complaintsData)

            // Department sheet data
            const departmentsData = data.departmentStats.map(d => ({
                'Department': d.name,
                'Organization': d.organization,
                'Total Complaints': d.totalComplaints,
                'Unresolved': d.unresolvedCount,
                'Resolved': d.resolvedCount,
                'Avg Resolution Time (h)': d.avgResolutionTime
            }))
            const departmentsSheet = XLSX.utils.json_to_sheet(departmentsData)

            // Workbook
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
            XLSX.utils.book_append_sheet(workbook, departmentsSheet, 'Departments')
            XLSX.utils.book_append_sheet(workbook, complaintsSheet, 'Details')

            // Column Widths
            summarySheet['!cols'] = [{ wch: 30 }, { wch: 15 }]
            complaintsSheet['!cols'] = [
                { wch: 35 }, { wch: 40 }, { wch: 15 },
                { wch: 25 }, { wch: 25 }, { wch: 25 },
                { wch: 25 }
            ]

            const filename = `Report_${new Date().getTime()}.xlsx`

            // Generate ArrayBuffer and trigger download with explicit MIME type
            const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
            const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            triggerDownload(blob, filename)

            await logExport('Excel')
            setSuccess(`Excel Downloaded: ${filename}`)
        } catch (err) {
            console.error('Excel export failed:', err)
            setError(`Failed to export Excel: ${err instanceof Error ? err.message : 'Unknown error'}`)
        } finally {
            setExporting(null)
        }
    }

    return (
        <div className="relative overflow-hidden group rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            {/* Branding Background */}
            <div
                className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04] bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: "url('/auth-branding-bg.png')" }}
            />

            <div className="relative z-10 p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                            <Download className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Download Performance Reports</h4>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Reports are formatted for management review</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={exportToPDF}
                            disabled={exporting !== null}
                            className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95"
                        >
                            {exporting === 'pdf' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FileText className="h-4 w-4" />
                            )}
                            PDF Report
                        </Button>
                        <Button
                            onClick={exportToExcel}
                            disabled={exporting !== null}
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                        >
                            {exporting === 'excel' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FileSpreadsheet className="h-4 w-4" />
                            )}
                            Excel Data
                        </Button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <div>
                            <p className="font-bold">Export Failed</p>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-xs text-green-600 dark:text-green-400 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            <p className="font-bold">{success}</p>
                        </div>
                        <p className="opacity-80">Check your device's downloads folder. If the file doesn't open, try using a different PDF/Excel viewer or check for browser download blocks.</p>
                    </div>
                )}

                {/* Help/Info */}
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="h-3 w-3 mt-0.5 opacity-50" />
                        <div>
                            <strong>Compatibility Note:</strong> If you cannot open the exported files on Windows, ensure you have a PDF viewer (like Adobe Reader or Edge) and Excel (or Google Sheets) installed. All files are scanned for safety before delivery.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
