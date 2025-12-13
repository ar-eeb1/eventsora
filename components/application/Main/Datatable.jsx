import { IconButton, Tooltip } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MaterialReactTable, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, useMaterialReactTable } from 'material-react-table'
import Link from 'next/link'
import React, { useState } from 'react'
import RecyclingIcon from '@mui/icons-material/Recycling';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import useDeleteMutation from '@/hooks/useDeleteMutation'
import ButtonLoading from '../ButtonLoading'
import { fa } from 'zod/v4/locales'
import { showToast } from '@/lib/showToast'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import { object } from 'zod'

const Datatable = ({
    queryKey,
    fetchUrl,
    columnsConfig,
    initialPageSize = 10,
    exportEndpoint,
    deleteEndpoint,
    deleteType,
    trashView,
    createAction
}) => {

    // filter , soritng and pagination states

    const [columnFilters, setColumnFilters] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const [rowSelection, setRowSelection] = useState({})
    const [exportLoading, setExportLoading] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: initialPageSize
    })

    // data fetching logics
    const {
        data: { data = [], meta } = {},
        isError,
        isRefetching,
        isLoading
    } = useQuery({
        queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
        queryFn: async () => {
            const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL)
            url.searchParams.set(
                'start',
                `${pagination.pageIndex * pagination.pageSize}`);
            url.searchParams.set('size', `${pagination.pageSize}`)
            url.searchParams.set('filters', JSON.stringify(columnFilters ?? []))
            url.searchParams.set('globalFilter', globalFilter ?? '')
            url.searchParams.set('sorting', JSON.stringify(sorting ?? []))
            url.searchParams.set('deleteType', deleteType)

            const { data: response } = await axios.get(url.href)
            return response
        },
        placeholderData: keepPreviousData,

    })

    // deleting handling
    const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint)
    const handleDelete = (ids, deleteType) => {
        let c
        if (deleteType === 'PD') {
            c = confirm('Delete Permanently?')
        } else if (deleteType === 'RSD') {
            c = confirm('Restore Data')
        } else {
            c = confirm('Move data into trash')
        }
        if (c) {
            deleteMutation.mutate({ ids, deleteType })
            setRowSelection({})
        }

    }

    // export
    const handleExport = async (selectedRows) => {
        setExportLoading(true)
        try {
            const csvConfig = mkConfig({
                fieldSeparator: ',',
                decimalSeparator: '.',
                useKeysAsHeaders: true,
                filename: 'Eventsora'
            })

            let csv
            if (Object.keys(rowSelection).length > 0) {
                // export only selected row
                const rowData = selectedRows.map((row) => row.original)
                csv = generateCsv(csvConfig)(rowData)
            } else {
                // export all data
                const { data: response } = await axios.get(exportEndpoint)
                if (!response.success) {
                    throw new Error(response.message)
                }
                const rowData = response.data
                csv = generateCsv(csvConfig)(rowData)
            }

            download(csvConfig)(csv)
        } catch (error) {
            console.log(error);
            showToast('error', error.message)
        } finally {
            setExportLoading(false)
        }
    }


    // init table
    const table = useMaterialReactTable({
        columns: columnsConfig,
        data,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        enableColumnOrdering: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        initialState: { showColumnFilters: true },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError ?
            {
                color: 'error',
                children: 'Error loading data'
            } : undefined,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        rowCount: meta?.totalRowCount ?? 0,
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
            rowSelection
        },
        getRowId: (originalRow) => originalRow._id,

        renderToolbarInternalActions: ({ table }) => (
            <>
                {/* buil in button */}
                <MRT_ToggleGlobalFilterButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
                <MRT_ToggleDensePaddingButton table={table} />



                {deleteType !== 'PD' &&
                    <Tooltip title='Recycle Bin'>
                        <Link href={trashView}>
                            <IconButton>
                                <RecyclingIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                }
                {
                    deleteType === 'SD' &&
                    <Tooltip title='Delete All'>
                        <IconButton onClick={() => handleDelete(Object.keys(rowSelection), deleteType)} disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                }
                {
                    deleteType === 'PD' &&
                    <>
                        <Tooltip title='Restore Data'>
                            <IconButton onClick={() => handleDelete(Object.keys(rowSelection), 'RSD')} disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}>
                                <RestoreIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Permanently delete data'>
                            <IconButton onClick={() => handleDelete(Object.keys(rowSelection), deleteType)} disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}>

                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                }
            </>
        ),
        enableRowActions: true,
        positionActionsColumn: 'last',
        renderRowActionMenuItems: ({ row }) => createAction(row, deleteType, handleDelete),

        renderTopToolbarCustomActions: ({ table }) => (
            <Tooltip>
                <ButtonLoading
                    type='button'
                    text='Export'
                    loading={exportLoading}
                    onClick={() => handleExport(table.getSelectedRowModel().rows)}
                />
            </Tooltip>
        )

    })

    return (
        <MaterialReactTable table={table} />
    )
}

export default Datatable
