function MessagesStyles ({ ...props }) {
  const { hovering, theme, sender, activeRow } = props;

  const styles = {
    conversationRow: {
      cursor: 'pointer',
      borderRadius: '8px',
      background: hovering || activeRow ? (theme === 'light' ? 'var(--primary-light-opacity)' : '#3c3c3c') : (theme === 'light' ? 'white' : 'default.main'),
      borderLeft: '5px solid',
      borderColor: hovering || activeRow ? 'primary.main' : 'transparent'
    },
    conversationRowMore: {
      display: 'flex',
      alignItems: 'center',
      color: '#3c3c3c',
    },
    conversationRowMoreBtn: {
      display: hovering || activeRow ? 'auto' : 'none',
    },
    conversationHeaders: {
      background: '#F4F4F4'
    },
    avatar: {
      backgroundColor: 'var(--white) !important',
      color: 'var(--primary) !important',
      border: '1px solid var(--grayTextsLight) !important',
    },
    chatContainer: {
      display: 'flex',
      alignItems: 'end'
    },
    messageContainer: {
      display: 'flex',
      justifyContent: sender && 'end',
      alignItems: 'end'
    },
    messageBox: {
      display: 'flex',
      justifyContent: sender && 'end',
      alignItems: 'center',
      height: 'fit-content'
    },
    message: {
      display: 'flex',
      justifyContent: sender && 'end',
      backgroundColor: sender ? 'messages.sender' : 'messages.receiver',
      padding: '.5rem',
      borderRadius: '8px',
      margin: '.5rem',
      color: theme === 'light' ? (sender ? 'white' : 'black') : 'white',
      width: '100%',
    },
    writeMessageInput: {
      maxHeight: '40px',
      padding: '0.2rem',
      fontSize: '13px',
      lineHeight: '18px',
      borderRadius: '16px',
      color: theme === 'light' && '#999999',
      width: '100%',
    },
    appBars: {
      backgroundColor: theme === 'light' && 'var(--white)',
      color: theme === 'light' ? 'black' : 'var(--white)'
    },
    image: {
      padding: '.2rem',
      borderRadius: '8px',
      maxHeight: '100%',
      maxWidth: '100%',
      cursor: 'pointer',
      display: 'block'
    },
    overlay: {
      position: 'absolute',
      display: 'flex',
      alignIitems: 'center',
      justifyContent: 'center',
      bottom: '0',
      background: 'rgba(0, 0, 0, 0.5)',
      /* Black see-through */
      color: '#f1f1f1',
      width: '50%',
      transition: '.5s ease',
      opacity: '1',
      textAlign: 'center',
      height: '50%',
      bordeRadius: '8px',
      padding: '2.2rem',
    },
    containerImages: {
      position: 'relative',
      cursor: 'pointer',
    }
  };

  return styles;
}

export default MessagesStyles;
