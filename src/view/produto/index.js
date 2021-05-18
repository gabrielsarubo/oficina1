import React, {useState, useEffect} from 'react';
import { useSelector} from 'react-redux';
import './produto.css';
import firebase from '../../config/firebase';
import Navbar from '../../components/navbar';
import Spinner from 'react-bootstrap/Spinner';

function Produto({match}){
    const [mensagem, setMensagem]  = useState();
    const [nome, setNome] = useState();
    const [preco, setPreco] = useState();
    const [quantidade, setQuantidade] = useState();
    const [descricao, setDescricao] = useState();
    const usuarioEmail = useSelector(state => state.usuarioEmail);
    const [carregando, setCarregando] = useState(0);

    const db = firebase.firestore();

    useEffect( () => {
        if(match.params.idPost){
            firebase.firestore().collection('posts').doc(match.params.idPost).get().then( resultado => {
                setNome(resultado.data().nome);
                setPreco(resultado.data().preco);
                setQuantidade(resultado.data().quantidade);
                setDescricao(resultado.data().descricao);
            })
        }
    }, [carregando, match.params.idPost])

    function atualizar(){
        setCarregando(1)
        setMensagem(null);

        db.collection('posts').doc(match.params.idPost).update({
            nome: nome,
            preco: preco,
            quantidade: quantidade,
            descricao: descricao,
        }).then( () => {
            setMensagem('ok');
            setCarregando(0);
        }).catch(erro => {
            setMensagem('erro');
            setCarregando(0);
        })
    }

    function postar(){
        setCarregando(1)

            db.collection('posts').add({
                nome: nome,
                preco: preco,
                quantidade: quantidade,
                descricao: descricao,
                criacao: new Date(),
                user: usuarioEmail,
            }).then(() => {
                setMensagem('ok');
                setCarregando(0);
            }).catch(() => {
                setMensagem('erro');
                setCarregando(0);
            })
    };

    return(
        <>
        <Navbar />
        <div className='cadastrar col-11'>
            <div className="row">
                <h3 className="mx-auto font-weight-bold my-5">{match.params.idPost ? 'Editar Produto' : 'Cadastrar Produto'}</h3>
            </div>

            <form>
                <div className="form-group my-3">
                    <label>Nome do Produto:</label>
                    <input onChange={(e) => setNome(e.target.value)} type="text" className="form-control" value={nome}/>
                </div>
                <div className="form-group row my-4">
                    <div className="col-6">
                        <label>Preço:</label>
                        <input onChange={(e) => setPreco(e.target.value)} type="text" className="form-control" value={preco}/> 
                    </div>
                    <div className="col-6">
                        <label>Quantidade:</label>
                        <input onChange={(e) => setQuantidade(e.target.value)} type="text" className="form-control" value={quantidade}/>
                    </div>
                </div>
                <div className="form-group my-4">
                    <label>Descrição:</label>
                    <textarea onChange={(e) => setDescricao(e.target.value)} className="form-control" rows="5" value={descricao}></textarea>
                </div>

                <div className="text-dark text-center my-4">
                    {mensagem === 'ok' && <span>&#9745;  A publicação foi enviada com sucesso!</span>}
                    {mensagem === 'erro' && <span><strong>&#9888;  Atenção! </strong> Falha no envio.</span>}
                </div>

                { carregando ? <Spinner className="mt-5 mb-5" animation="border" variant="success" role="status"></Spinner>
                  : <button onClick={match.params.idPost ? atualizar : postar} type="button" className="btn btn-lg btn-block mt-3 mb-5 btn-cadastro">{match.params.idPost ? 'Atualizar' : 'Adicionar'}</button>
                }

            </form>

        </div>
        </>
    );
}


export default Produto;