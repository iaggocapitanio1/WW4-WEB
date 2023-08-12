function getKeywords () {
  const keywords = {
    errorKeywords: ['Não', 'Não Iniciada', 'Indisponível', 'Indisponível'],
    successKeywords: ['Entregue', 'Terminada', 'Disponível'],
    warningKeywords: ['Iniciada', 'Em Curso']
  };

  return keywords;
}

export default getKeywords;
