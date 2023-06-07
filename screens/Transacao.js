
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
            import {TextInput} from "react-native";
                //Permissões
                import * as Permissions from "expo-permissions";
                    //Scanner
                    import {BarCodeScanner} from "expo-barcode-scanner";
                        //Imagem fundo
                        import {ImageBackground} from "react-native";

//Constantes
    //Constante Imagem Fundo
    const Imagem_fundo = require("../assets/fundo.png");
        //Constante Imagem Ícone
        const Imagem_icone = require("../assets/livros.png");
            //Constante Imagem nome
            const Imagem_nome = require("../assets/nome.png");


//Classe pesquisa
export default class Trade extends Component{

    constructor(props){
        super(props)
            this.state = {    
                bookId: "",
                studentId: "",
                domState: "normal", /*Estado do modo*/
                hasCameraPermissions: null, /*Permissões da Câmera*/
                scanned: false, /*Digitalizado*/
                bookName: "",
                studentName: ""
            } 
    }

    //Permissão da câmera
    permCamera =async domState=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
            this.setState({
                hasCameraPermissions: status === "granted",
                domState: domState,
                scanned: false
            })
    }

    //Digitalização do QRCode concluida
    digiConcluida =async ({type, data})=>{
        if (domState === "bookId"){
            this.setState({
                scannedData: data,
                domState: "normal",
                scanned: true
            })
        } else if (domState === "bookId"){
            this.setState({
                scannedData: data,
                domState: "normal",
                scanned: true
            })
        }
    }

    //Realizar Transação
    fazerTransação = async()=>{
        var{bookId, studentId} = this.state;
        await this.getBookDetails(bookId);
        await this.getStudentDetails(studentId);

            //Tipo de transação
            var tipo_transacao = await this.livroDisponivel(bookId)

            if(!tipo_transacao){
                this.setState({bookId: "", studentId: ""});

                    //Alerta
                    Alert.alert("O livro não existe na biblioteca");

            }       else if(tipo_transacao === "issue"){
                    var elegivel = await this.estudanteElegivel(studentId);

                    if(elegivel){
                            var {bookName, studentName} = this.state;

                            this.informacoes(bookId, bookName, studentId, studentName);
                    };
                    Alert.alert("Livro entregue ao aluno!!!");
                }              else {
                            var elegivel = await this.estudanteRetornar(bookId, studentId);
                            
                                if(elegivel){
                                    var {bookName, studentName} = this.state;
        
                                    this.retornar(bookId, bookName, studentId, studentName);
                                }
                    Alert.alert("Livro devolvido à biblioteca!!!");
                            
                        };

    };

        //Pegar detalhes livro
        detalhesLivro = bookId => {
            bookId = bookId.trim();
                db.collection("books")
                    .where("book_id", "==", bookId)
                    .get()
                    .then(snapshot => {
                        snapshot.docs.map(doc => {
                            this.setState({
                                bookName: doc.data().book_details.book_name
                            })
                        })
                    }
                    )
        }
        //Pegar detalhes estudante
        detalhesEstudante = student_id => {
            student_id = student_id.trim();
                db.collection("student")
                    .where("student_id", "==", student_id)
                    .get()
                    .then(snapshot => {
                        snapshot.docs.map(doc => {
                            this.setState({
                                student_id: doc.data().student.details.student_name
                            })
                        })
                    }
                    )
        }

        //Checando disponibilidade do livro
        livroDisponivel = async book_id =>{
            const bookRef = await db
                .collection("books")
                .where("book_id", "==", book_id)
                .get();

            var tipo_transacao = "";

            if (bookRef.docs.length === 0){
                
                tipo_transacao = false;
            } else{
                bookRef.docs.map(doc =>{
                    tipo_transacao = doc.data().is_book_avaliable ? "issue" : "return";
                })
            }
            return tipo_transacao;
        }

        //Estudante elegível
        estudanteElegivel = async student_id => {
            const studentRef = await db
            .collection("students")
            .where("student_id", "==", student_id)
            .get();

                var elegivel = "";

            if (studentRef.docs.length === 0){
                this.setState({
                    book_id: "",
                    student_id: ""
                })
                elegivel = false;
                    Alert.alert("ID do aluno não está no banco de dados!!!");
            } else{
                studentRef.docs.map(doc =>{
                    if (doc.data().number_of_books_issued < 2){
                        elegivel = true;

                    } else{
                        elegivel = false;
                            Alert.alert("Aluno já retirou 2 livros!!!");
                        this.setState({
                            book_id: "",
                            student_id: ""
                        }) 
                    }
                })
              }
              return elegivel;
        }

        //Verificar elegibilidade para retorno do livro
        retornoElegível = async(student_id, book_id) => {
            const transactionRef = await db
            .collection("transactions")
            .where("book_id", "==", book_id)
            .get();

            var elegivel = "";
                transactionRef.docs.map(doc => {
                    var ultimatransacao = doc.data()
                    if(ultimatransacao.student_id === student_id){

                        elegivel = true;
                    } else {
                        elegivel = false;
                            Alert.alert("O livro não foi retirado por esse aluno!")
                        this.setState({
                            book_id: "",
                            student_id: ""
                        })
                    }
                })
                return elegivel;
        }

        //Retirada do livro
        retirarLivro = async (book_id, student_id, book_name, student_name) => {

            //Adicionar transação
            db.collection("transaction").add({
                student_id: student_id,
                student_name: student_name,
                book_id: book_id,
                book_name: book_name,
                date: firebase.firestore.Timestamp.now().toDate(),
                transaction_type: "issue"
            })
            //Alterar status livro
            db.collection("books")
                .doc(book_id)
                .update({
                livroDisponivel: false
                })
            //Alterar número de livros retirados
            db.collection("students")
                .doc(student_id)
                .update({
                number_of_books_issued: firebase.firestore.FieldValue.increment(1)
                })
            //Atualizar estado
            this.setState({
                book_id: "",
                student_id: ""
            })
        }

        //Devolução do livro
        devolverLivro = async (book_id, student_id, book_name, student_name) => {

            //Adicionar transação
            db.collection("transaction").add({
                student_id:student_id,
                student_name:student_name,
                book_id: book_id,
                book_name: book_name,
                date: firebase.firestore.Timestamp.now().toDate(),
                transaction_type: "return"
            })
            //Alterar status livro
            db.collection("books")
                .doc(book_id)
                .update({
                livroDisponivel: true
                })
            //Alterar número de livros retirados
            db.collection("students")
                .doc(student_id)
                .update({
                number_of_books_issued: firebase.firestore.FieldValue.increment(-1)
                })
            //Atualizar estado
            this.setState({
                book_id: "",
                student_id: ""
            })
        }


        //Renderização
        render(){

            const {domState, hasCameraPermissions, scanned, scannedData} = this.state

                if (domState === "scanner"){
                    return(
                        <BarCodeScanner onBarCodeScanned = {scanned ? undefined:this.digiConcluida}
                        style={StyleSheet.absoluteFillObject}></BarCodeScanner>
                    )
                }

                    return(
                        <View style={styles.fundo}>
                            <ImageBackground source = {Imagem_fundo} style={styles.image_fundo}>   
                                <View style={styles.container22}>
                                    <Image source = {Imagem_icone} style={styles.livro}></Image>    
                                </View>  
                                <View style={styles.container21}>
                                <Image source = {Imagem_nome}></Image>    
                                </View>  
                                
                                    <View style={styles.container2}>
         
                                        <View style={styles.container3}>
                                            <TextInput placeholder = "ID do livro" style={styles.containerID}></TextInput>
                                            <TouchableOpacity style={styles.botao} onPress = {()=>{
                                                this.permCamera("scanner")
                                            }}>
                                                <Text style={styles.texto_botao}>DIGITALIZAR</Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                        <View style={styles.container3}>
                                            <TextInput placeholder = "ID do estudante" style={styles.containerID}></TextInput>
                                            <TouchableOpacity style={styles.botao} onPress = {()=>{
                                                this.permCamera("scanner")
                                            }}>
                                                <Text style={styles.texto_botao}>DIGITALIZAR</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                        <TouchableOpacity style={styles.botaoEnviar}>
                                            <Text style={styles.texto_botao}>ENVIAR</Text>

                                        </TouchableOpacity>
                            </ImageBackground>
                        </View>
                    )
                    
        }
}

const styles = StyleSheet.create({

    fundo: {
        flex: 1,
        justifyContent: "center",
        alignItens: "center",
        backgroundColor: "#e5e7b9"
    },

    botao: {
        width: 150,
        height: 50,
        justifyContent: "center",
        alignItens: "center",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: "#470048",
    },

    texto_botao: {
        fontSize: 20,
        color: "#e5e7b9",
        fontWeight: "bold",
        textAlign: "center"
    },

    texto_permissao: {
        textAlign:"center",
        fontSize: 20,
        fontWeight: "bold",
        color: "red"
    },

    image_fundo: {
        flex:1,
        resizeMode: "cover",
        justifyContent: "center"
    },

    container2: {
        flex:0.5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -180,
    },

    container21: {
        flex:0.5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
    },

    container22: {
        flex:0.5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 90,
    },

    livro: {
        width:200,
        height:200,
        resizeMode: "contain",
        marginTop: 350
    },

    container3: {
        borderWidth: 4,
        borderRadius: 10,
        flexDirection: "row",
        backgroundColor: "#470048",
        borderColor: "white",
        marginTop: 25
    },

    containerID: {
        width:"50%",
        height: 50,
        padding: 10,
        borderColor: "#white",
        borderWidth: 3,
        fontSize: 18,
        backgroundColor: "#470048",
        textAlign: "center",
        color: "white",
        
    },

    botaoEnviar: {
        width: 150,
        height: 50,
        justifyContent: "center",
        alignItens: "center",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: "#470048",
        borderColor: "white",
        borderWidth: 3,
        borderRadius: 5,
        marginLeft: 283,
        marginBottom: 50
    },
})