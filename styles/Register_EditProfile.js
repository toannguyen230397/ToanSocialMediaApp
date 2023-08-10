import { StyleSheet } from 'react-native'

export default styles=StyleSheet.create({
    container:{
        flex: 1,
    },
    header: {
        flex: 1,
    },
    header__text:{
        fontSize: 20,
        fontWeight: "500",
        color: "white",
        marginLeft: 20,
        marginBottom: 20
    },
    body: {
        flex: 3,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 50,
        paddingLeft: 30,
        paddingRight: 30,
    },
    image: {
        marginTop: 5,
        width: 15,
        height: 15
    },
    formInput: {
        height: 50,marginLeft:20
        
    },
    bodyTextInput: {
        width: '80%',
        marginBottom:10, 
        backgroundColor:'#E0E0E0',
        borderRadius:10,
    },
    body__password: {
        flexDirection: "row",
        marginBottom:35,
        backgroundColor:'#E0E0E0',
        height: 50,width:'80%',
        borderRadius:10
    },
    button: {
        width: "80%",
        height: 50,
        alignItems: "center",
        fontSize: 25,
        justifyContent: "center",
        marginTop: 20,
        borderRadius: 10,
    },
    button__SignUp: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E0E0E0"
    }
})