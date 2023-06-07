
//Importando o que será usado
  //React
  import React from "react"; 
    //Componentes (botão, texto, view, touchableopacity, image)
    import {Button} from "react-native";
      import {Text} from "react-native";
    import {View} from "react-native";  
      import {TouchableOpacity} from "react-native";
    import {Image} from "react-native";
      //Component
      import {Component} from "react";
        //Stylesheet
        import {StyleSheet} from "react-native";
            //TextInpunt
            import {TextInput} from "react-native"
          
  //Classes
  import Botao from "./Navegador";

//Classe padrão do App
export default class App extends Component{


  //Renderização
  render(){

      return(
        <Botao></Botao>

      )
          

  }
}