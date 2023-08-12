/* eslint-disable consistent-return */
/* eslint-disable no-fallthrough */
import { Tooltip, Typography } from '@mui/material';
import React from 'react';
import displayWithStyle from './displayTextWithStyle';

const FilterItem = (data, item, col) => {
  // eslint-disable-next-line no-constant-condition
  if (Object.keys(data).length !== 0 || true) {
    const col2 = col.split('.');

    switch (Object.keys(col.split('.')).length) {
    case 1: {
      switch (col2[0]) {
      case 'Estado': {
        switch (item?.Estado?.toLowerCase()) {
        case 'needs analysis': return <Typography variant='sm' className="analisysBalloon">Pendente Análise Necessidades</Typography>;
        case 'waiting budget': return <Typography variant='sm' className="waitingBudgetBalloon">Pendente Orçamentação</Typography>;
        case 'waiting adjudication': return <Typography variant='sm' className="infoBalloon">Pendente Adjudicação</Typography>;
        case 'drawing': return <Typography variant='sm' className="drawingBalloon">Pendente Desenho</Typography>;
        case 'production': return <Typography variant='sm' className="productionBalloon">Pendente Produção</Typography>;
        case 'packing': return <Typography variant='sm' className="packingBalloon">Pendente Embalamento</Typography>;
        case 'testing': return <Typography variant='sm' className="assemblyBalloon">Pendente Montagem</Typography>;
        case 'transport': return <Typography variant='sm' className="expeditionBalloon">Pendente Expedição</Typography>;
        case 'finished': return <Typography variant='sm' className="successBalloon">Terminado</Typography>;
        case 'canceled': return <Typography variant='sm' className="errorBalloon">Cancelado</Typography>;
        }
      }

      case 'Occupied': {
        if (!item?.Occupied) return <Typography variant='sm' className="successBalloon">Disponível</Typography>;

        return <Typography variant='sm' className="packingBalloon">Em utilização</Typography>;
      }

      case 'amount': {
        if (item[col2[0]] === 0) { return <Tooltip title={`${item[col2[0]]} unidade(s)`}><Typography variant='sm' className="errorBalloon">Indisponível</Typography></Tooltip>; }

        return <Tooltip title={`${item[col2[0]]} unidade(s)`}><Typography variant='sm' className="successBalloon">Disponível</Typography></Tooltip>;
      }

      default: if (['giveName', 'nome', 'name', 'custo'].find(ele => ele === col2[0])) return <Typography variant='sm' color="link.main" className="link" >{item[col2[0]]}</Typography>;

        return <Typography variant='sm'>{item[col2[0]]} </Typography>;
      }
    }

    default: return <Typography variant='sm'>{displayWithStyle(item[col], col)}</Typography>;
    }
  }
};

export { FilterItem };
