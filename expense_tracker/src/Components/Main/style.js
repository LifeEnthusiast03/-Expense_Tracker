import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({

    card: {
        backgroundColor: 'rgba(208, 40, 40, 0.5)',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
      
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    cartContent: {
      paddingTop: 0,
      
    },
    divider: {
      margin: '20px 0',
    },
  }));