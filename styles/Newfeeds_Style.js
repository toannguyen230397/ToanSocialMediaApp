import { StyleSheet } from 'react-native'

export default styles=StyleSheet.create({
    container:{
        backgroundColor: 'white', 
        marginTop: 15, 
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20,
    },
    newfeeds_container:{
        marginLeft: 10, 
        marginTop: 10
    },
    newfeeds:{
        flexDirection: 'row',
    },
    newfeeds_postby_avatar:{
        width: 30, 
        height: 30, 
        borderRadius: 100,
    },
    newfeeds_postby_name:{
        paddingLeft: 10,
    },
    newfeeds_content_text:{
        marginTop: 5
    },
    newfeeds_content_image:{
        height: 300
    },
    newfeeds_container_button: {
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: '#edf0ef',
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    newfeeds_icon_button:{
        width: 30, 
        height: 30
    },
    newfeeds_heart_button:{
        paddingLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    newfeeds_comments_button:{
        paddingLeft: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    newfeeds_share_button:{
        paddingRight: 10, 
        justifyContent: 'center'
    }
})