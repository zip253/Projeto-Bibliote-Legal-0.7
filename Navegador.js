
import React, { Component } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import Trade from "./screens/Transacao";
import Search from "./screens/Pesquisa";



            //Constante
            const Tab = createBottomTabNavigator()


//Classe botao
export default class Botao extends Component{


    //Renderização
    render(){

        return(
          <NavigationContainer>
            <Tab.Navigator 
            screenOptions = {({route})=>({
              tabBarIcon: ({focused,color,size}) =>{
              var nome_icone 

            if(route.name === "Transação"){
              nome_icone = "book"
            } else if(route.name === "Pesquisa"){
              nome_icone = "search"
            }
            
            return(
              <Ionicons 
              name = {nome_icone} 
              size = {size} 
              color = {color}
              size = {size}></Ionicons>
            )}})}
            
            tabBarOptions = {{
              activeTintColor:"#470048",
              inactiveTintColor: "white",
              style: {height:130, borderTopWidth:0, backgroundColor: "#020202"},
              labelStyle: {fontSize:20},
              tabStyle: {marginTop: 5, marginLeft:10, marginRight: 10, borderRadius:30, borderWidth:2, alignItens: "center", justifyContent: "center", backgroundColor: "#e5e7b9"},
              labelPosition: "beside-icon"
            }}>
                <Tab.Screen name = "Transação" component = {Trade}></Tab.Screen>
                    <Tab.Screen name = "Pesquisa" component = {Search}></Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
        )
            

    }
}
