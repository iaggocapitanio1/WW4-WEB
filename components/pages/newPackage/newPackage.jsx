/* eslint-disable array-callback-return */
/* eslint-disable no-constant-condition */
/* eslint-disable react/prop-types */
import { Box, Button, ButtonGroup, Grid, Grow, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CustomBreadcrumbs from '../../breadcrumbs';
import PrimaryBtn from '../../buttons/primaryBtn';
import Notification from '../../dialogs/Notification';
import Footer from '../../layout/footer/footer';
import Navbar from '../../layout/navbar/navbar';
import ToastSet from '../../utils/ToastSet';

const newPacking = (props) => {
  const { breadcrumbsPath } = props;
  const reduxState = useSelector((state) => state);

  const [parts, setParts] = useState(props.parts || [
    {
      id: Math.random(),
      name: 'Porta',
      amount: 2,
      type: 'part',
      weight: 4
    },
    {
      id: Math.random(),
      name: 'Gaveta',
      amount: 4,
      type: 'part',
      weight: 1.2
    },
    {
      id: Math.random(),
      name: 'Prateleira',
      amount: 3,
      type: 'part',
      weight: 2
    },
    {
      id: Math.random(),
      name: 'Puxador',
      amount: 10,
      type: 'part',
      weight: 0.32
    },
    {
      id: Math.random(),
      name: 'Dobradiça',
      amount: 6,
      type: 'part',
      weight: 0.1
    },
  ]);

  const [assemblys, setAssemblys] = useState([
    {
      id: { value: Math.random() },
      partName: { value: 'Armário de Cozinha' },
      type: 'assembly',
      amount: { value: 5 },
      weight: { value: 3.6 }
    },
    {
      id: { value: Math.random() },
      partName: { value: 'Cama de Solteiro' },
      type: 'assembly',
      amount: { value: 5 },
      weight: { value: 20.6 }
    },
  ]);

  const [selected, setSelected] = useState([]);

  const handleTransfer = (value) => () => {
    const clickedIndex = selected.findIndex(item => item.id === value.id);

    if (clickedIndex !== -1) {
      const clickedItem = selected[clickedIndex];
      const newSelected = [...selected];

      newSelected.splice(clickedIndex, 1);

      if (clickedItem.type === 'Part') {
        const existingPartIndex = parts.findIndex(part => part.id === clickedItem.id);

        if (existingPartIndex !== -1) {
          const existingPart = parts[existingPartIndex];
          const updatedSelected = [...selected];
          const updatedAmount = clickedItem.amount.value + existingPart.amount.value;
          const updatedPart = { ...existingPart, amount: { ...existingPart.amount, value: updatedAmount } };

          updatedSelected[clickedIndex] = updatedPart;
          setParts(parts => parts.map(part => part.id === existingPart.id ? updatedPart : part));
          setSelected(updatedSelected);
        } else {
          setParts([...parts, clickedItem]);

          const newSelected = selected.filter(item => item.id !== clickedItem.id);

          setSelected(newSelected);
        }
      } else if (clickedItem.type === 'assembly') {
        const existingAssemblyIndex = assemblys.findIndex(assembly => assembly.id === clickedItem.id);

        if (existingAssemblyIndex !== -1) {
          const existingAssembly = assemblys[existingAssemblyIndex];
          const updatedSelected = [...selected];
          const updatedAmount = clickedItem.amount.value + existingAssembly.amount.value;
          const updatedAssembly = { ...existingAssembly, amount: { ...existingAssembly.amount, value: updatedAmount } };

          updatedSelected[clickedIndex] = updatedAssembly;
          setAssemblys(assemblys => assemblys.map(assembly => assembly.id === existingAssembly.id ? updatedAssembly : assembly));
          setSelected(updatedSelected);
        } else {
          setAssemblys([...assemblys, clickedItem]);

          const newSelected = selected.filter(item => item.id !== clickedItem.id);

          setSelected(newSelected);
        }
      }

      setSelected(newSelected);
    } else if (value.type === 'Part') {
      const clickedPartIndex = parts.findIndex(part => part.id === value.id);

      if (clickedPartIndex !== -1) {
        const clickedPart = parts[clickedPartIndex];
        const newParts = [...parts];

        newParts.splice(clickedPartIndex, 1);
        setParts(newParts);
        setSelected([...selected, clickedPart]);
      }
    } else if (value.type === 'assembly') {
      const clickedAssemblyIndex = assemblys.findIndex(assembly => assembly.id === value.id);

      if (clickedAssemblyIndex !== -1) {
        const clickedAssembly = assemblys[clickedAssemblyIndex];
        const newAssemblys = [...assemblys];

        newAssemblys.splice(clickedAssemblyIndex, 1);
        setAssemblys(newAssemblys);
        setSelected([...selected, clickedAssembly]);
      }
    }
  };

  useEffect(() => {
    const client = props.project.client.user;
    const address = props.project.budget.deliveryAddress.value;
    let newUrl = `
Cliente: ${client.first_name} ${client.last_name}
Projeto: ${props.project.name.value}
Morada: ${address.streetAddress} ${address.postalCode} ${address.addressLocality} ${address.addressRegion} ${reduxState?.countries?.data?.find(ele => ele.cca2 === address.addressCountry).name.common}
Peso Embalagem: ${ItemsWeight()}

Conteudo:
`;

    selected.map((item) => {
      newUrl += `${item.amount.value} ${item.type} ${item.partName.value}
`;
    });

    setUrl(newUrl);
  }, [selected]);

  function handlenewPacking () {
    const loading = toast.loading('');

    downloadQRCode();
    setSelected([]);
    ToastSet(loading, 'Adicionado!', 'success');

    false && fetch('http://193.136.195.25/media/mofreitas/clientes/bruno.barros@nka.pt/Completo/briefing/VF%20do%20Cliente/VF__Placard_chambre_damis.pdf')
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'QrCode.png'; // Change this to the desired file name if needed
        document.body.appendChild(a);

        setTimeout(() => {
          a.click();
          setSelected([]);
          ToastSet(loading, 'Adicionado!', 'success');

          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 0);
        }, 1000);
      });
  }

  function ItemsWeight () {
    let weight = 0;

    // eslint-disable-next-line no-return-assign
    selected.map((item) => weight += (item.weight?.value || 0) * item.amount.value);

    return weight.toFixed(2) + ' kg';
  }

  function onAmountChange ({ e, value, action }) {
    e.stopPropagation();

    if (!action || (action === '+' && !parts.concat(assemblys).some(ele => ele.id === value.id))) return;

    setSelected((prevSelected) => {
      const updatedSelected = [...prevSelected];
      const index = updatedSelected.findIndex((item) => item.id === value.id);

      if (index !== -1) {
        // Item exists in selected array
        const updatedItem = { ...updatedSelected[index] };

        updatedItem.amount = { ...updatedItem.amount, value: action === '+' ? updatedItem.amount.value + 1 : updatedItem.amount.value - 1 };

        if (updatedItem.amount.value === 0) {
          // Remove item from array if amount is zero
          updatedSelected.splice(index, 1);
        } else {
          // Update item in array with new amount
          updatedSelected[index] = updatedItem;
        }

        if (value.type === 'Part') {
          const partsIndex = parts.findIndex((part) => part.id === value.id);

          if (partsIndex !== -1) {
            // Item exists in parts array
            const updatedParts = [...parts];
            const partsItem = { ...updatedParts[partsIndex] };

            if (action === '+') {
              partsItem.amount.value--;
            } else {
              partsItem.amount.value++;
            }

            if (partsItem.amount.value === 0) {
              // Remove item from array if amount is zero
              updatedParts.splice(partsIndex, 1);
            } else {
              // Update item in array with new amount
              updatedParts[partsIndex] = partsItem;
            }

            setParts(updatedParts);
          } else {
            // Item does not exist in parts array, add it
            const newPart = { ...value, amount: { ...value.amount, value: 1 } };

            setParts([...parts, newPart]);
          }
        } else if (value.type === 'assembly') {
          const assemblysIndex = assemblys.findIndex((assembly) => assembly.id === value.id);

          if (assemblysIndex !== -1) {
            // Item exists in assemblys array
            const updatedAssemblys = [...assemblys];
            const assemblysItem = { ...updatedAssemblys[assemblysIndex] };

            if (action === '+') {
              assemblysItem.amount.value--;
            } else {
              assemblysItem.amount.value++;
            }

            if (assemblysItem.amount.value === 0) {
              // Remove item from array if amount is zero
              updatedAssemblys.splice(assemblysIndex, 1);
            } else {
              // Update item in array with new amount
              updatedAssemblys[assemblysIndex] = assemblysItem;
            }

            setAssemblys(updatedAssemblys);
          } else {
            // Item does not exist in assemblys array, add it
            const newAssembly = { ...value, amount: { ...value.amount, value: 1 } };

            setAssemblys([...assemblys, newAssembly]);
          }
        }
      }

      return updatedSelected;
    });
  }

  const CustomList = ({ title, items, selected }) => {
    let total = 0;

    // eslint-disable-next-line no-return-assign
    items.map((item) => total += item.amount.value);

    return <Card >
      <Grid container md={12} sm={12} xs={12} >
        <Grid container md={4} sm={4} xs={4}> <CardHeader
          sx={{ px: 2, py: 1 }}
          avatar={
            <></>
          }
          title={<Typography fontWeight={'bold'} variant="subtitle1">{title}</Typography>}
          subheader={`${total} item(s)`}
        />
        </Grid>
        <Grid container md={4} sm={4} xs={4} justifyContent={'center'} alignItems={'center'}>
          {selected && items.length > 0 &&
            <Typography variant="subtitle2">Peso: {ItemsWeight()}</Typography>
          }
        </Grid>
        <Grid container md={4} sm={4} xs={4} justifyContent={'end'}>
          <Box>
            {selected && items.length > 0 &&
            <Grow in={true}>
              <Box sx={{ px: 2, py: 1 }}>
                <PrimaryBtn text={'Embalar'} onClick={() => handlenewPacking()} />
              </Box>
            </Grow>
            }
          </Box>
        </Grid>
      </Grid>

      <Divider />
      <List
        sx={{
          bgcolor: 'background.paper',
          overflow: 'scroll',
          maxHeight: '60vh'
        }}
        dense
        component="div"
        role="list"
      >
        {[...items]?.sort((a, b) => (a.partName?.value > b.partName?.value) ? 1 : -1).map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleTransfer(value)}
            >

              <ListItemText id={labelId} primary={`${value.partName?.value.replace(/_/g, ' ')}`} secondary={`Quantidade: ${value.amount.value}`} />
              {selected &&
              <Box>
                <ButtonGroup>
                  <Button onClick={(e) => onAmountChange({ e, value, action: '-' })}>-</Button>
                  <Button onClick={(e) => onAmountChange({ e, value, action: '' })}>{value.amount.value}</Button>
                  <Button onClick={(e) => onAmountChange({ e, value, action: '+' })}>+</Button>
                </ButtonGroup>
              </Box>
              }
            </ListItem>
          );
        })}
      </List>
    </Card>;
  };

  const qrCodeRef = useRef(null);
  const [url, setUrl] = useState('');

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={url}
      size={300}
      // level={'H'}
    />
  );

  const downloadQRCode = (event) => {
    event?.preventDefault();

    html2canvas(qrCodeRef.current).then((canvas) => {
      const link = document.createElement('a');

      link.download = 'qrcode.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return <>
    <Box display='all' sx={{ position: 'absolute', right: '100%' }}>
      <div className="qrcode__container">
        <div ref={qrCodeRef} style={{ width: 'fit-content', height: 'fit-content' }}>{qrcode}</div>
      </div>
    </Box>
    <Navbar />
    <Grid component='main' sx={{ padding: '0rem 2rem 4rem 2rem' }}>
      <CustomBreadcrumbs path={breadcrumbsPath} />
      <Notification />
      <Grid id={'pad'} container >
        <Grid container md={12} >
          <Grid md={4} item sx={{ padding: 1 }}>
            <CustomList title='Peças' items={parts}/>
          </Grid>
          <Grid md={4} item sx={{ padding: 1 }}>
            <CustomList title='Assemblys' items={assemblys}/>
          </Grid>
          <Grid md={4} item sx={{ padding: 1 }}>
            <CustomList selected title='Para Embalar' items={selected}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    <Footer/>
  </>;
};

export default newPacking;
