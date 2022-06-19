import React, {useCallback} from 'react';
import {useTable} from 'react-table';
import {useVault} from 'Services/vault';
import formulas from 'Utils/formulas';
import styles from './PositionsTable.scss';
import {formatDollars} from 'Utils/formatters';
import Button from "Components/Button";

const PositionsTable = ({onSubmit}) => {
    const columns = React.useMemo(() => {
        return getColumns();
    }, [])
    const {positions, currentPosition, setCurrentPosition, collateralPrice, closePosition} = useVault();
    const handleOnClickCheckbox = useCallback((cell) => {
        const activePosition = positions.find(position => position.id == cell.row.id);
        setCurrentPosition(activePosition[0]);
    }, [positions]);
    const handleClose = useCallback((id) => {
        closePosition(id)
    }, [positions]);

    const data = React.useMemo(() => {
        return constructTableData(positions, currentPosition, collateralPrice)
    }, [positions, currentPosition, setCurrentPosition])
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    })
    return (
        <table {...getTableProps()} className={styles.positionsTable}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return renderCell(cell, currentPosition, handleOnClickCheckbox, handleClose);
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}

function constructTableData(positions, currentPosition, collateralPrice) {
    const positionDataTable = [];
    positions.forEach((position) => {
        positionDataTable.push({
            id: position.id,
            activePosition: position.id === currentPosition?.id,
            collateralLocked: position.collateralAmount,
            debt: formatDollars(position.stableAmount),
            collateralRatio: formulas.getCollateralRatio(position.collateralAmount, collateralPrice, position.stableAmount),
            liquidationPrice: formatDollars(formulas.getLiquidationPrice(position.collateralAmount, position.stableAmount)),
            status: defineStatus(position)
        });
    });
    return positionDataTable;
}

function getColumns() {
    return [
        {
            Header: 'Active position',
            accessor: 'activePosition',
        },
        {
            Header: 'Collateral Locked',
            accessor: 'collateralLocked',
        },
        {
            Header: 'Debt',
            accessor: 'debt',
        },
        {
            Header: 'Collateral ratio',
            accessor: 'collateralRatio',
        },
        {
            Header: 'Liquidation price',
            accessor: 'liquidationPrice',
        },
        {
            Header: 'Status',
            accessor: 'status',
        },
        {
            Header: 'Close position',
            accessor: 'close'
        }
    ]
}

function renderCell(cell, currentPosition, handleOnClickCheckbox, handleClose) {
    const cellAction = {
        'activePosition': toActivePosition(cell, handleOnClickCheckbox, currentPosition),
        'close': toClose(cell, handleClose, currentPosition),
        'status': createCellForStatus(cell.value, cell)
    }
    return cellAction[cell.column.id] || <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
}

function toClose(cell, handleClose, currentPosition) {
    const id = cell.row.original.id;
    return <td><Button onClick={event => handleClose(id)} className={styles.closeButton}
                       disabled={currentPosition?.id !== id}>
        Close
    </Button>
    </td>
}

function toActivePosition(cell, handleOnClickCheckbox, currentPosition) {
    const id = cell.row.original.id;
    return <td><label className="form-control">
        <input type="checkbox" name="checkbox-checked"
               checked={currentPosition?.id === id}
               onClick={event => handleOnClickCheckbox(cell)}/>
    </label>
    </td>
}

function defineStatus(position) {
    if (position.liquidated) {
        return 'Liquidated';
    }
    if (position.deleted) {
        return 'Closed';
    }
    return 'Active';
}

function createCellForStatus(status, cell) {
    switch (status) {
        case 'Active':
            return <td className={styles.Active}>{cell.render('Cell')}</td>;
        case 'Closed':
            return <td className={styles.Closed}>{cell.render('Cell')}</td>;
        case 'Liquidated':
            return <td className={styles.Liquidated}>{cell.render('Cell')}</td>;
    }
}

export default PositionsTable;