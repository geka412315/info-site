import React, {Component} from 'react';
import {firebase, firebaseDB, firebaseLooper, firebaseArticles} from "../../../../firebase";

import styles from '../../articles.css';
import Header from './header';

class NewsArticles extends Component {

    state = {
        article:[],
        author:[],
        imageURL:''
    }

    componentWillMount(){

        firebaseDB.ref(`articles/${this.props.match.params.id}`).once('value')
            .then((snapshot)=>{
                let article=snapshot.val();

                firebaseArticles.orderByChild('id').equalTo(article.author).once('value')
                    .then((snapshot)=>{
                        const author=firebaseLooper(snapshot);
                        this.setState({
                            article,
                            author
                        })
                        this.getImageURL(article.image)
                    })
            })

        // axios.get(`http://localhost:3004/articles?id=${this.props.match.params.id}`)
        //     .then(response => {
        //         let article = response.data[0];
        //
        //         axios.get(`http://localhost:3004/articles?id=${this.props.match.params.id}`)
        //             .then(response => {
        //                 this.setState({
        //                     article,
        //                     author:response.data
        //                 })
        //             })
        //     })

    }

    getImageURL=(filename)=>{
        firebase.storage().ref('images')
            .child(filename).getDownloadURL()
            .then(url=>{
                this.setState({
                    imageURL:url
                })
            })
    }

    render(){
        const article = this.state.article;
        // const team = this.state.team;
        return(
            
        <div className={styles.articleWrapper}>
           <Header
               // authorData={author[0]}
               date={article.date}
               author={article.author}

           />
           <div className={styles.articleBody}>
               <h1>{article.title}</h1>
               <div className={styles.articleImage}
                style={{
                    background:`url('${this.state.imageURL}')`

                }}
               >
               </div>
               <div className={styles.articleText}
                    dangerouslySetInnerHTML={{
                        __html:article.body
                    }}
               >
               </div>
           </div>
        </div>
        )
    }
}
export default  NewsArticles;