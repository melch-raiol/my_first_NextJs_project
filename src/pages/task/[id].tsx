import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";

import { db } from '../../services/firebaseConnection';
import {
    doc,
    collection,
    query,
    where,
    getDoc
} from 'firebase/firestore';
import { Textarea } from "../../components/textarea";

interface TaskProps {
    item:{
        tarefa: string;  
        public:  string;
        create:  boolean;
        user:  string;
        taskId: string;
    }
}

export default function Task({item}: TaskProps){
    return (
        <div className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>

            <main className={styles.main}>
                <h1>Tarefas</h1>
                <article className={styles.task}>
                    <p>{item.tarefa}</p>
                </article>
            </main>

            <section className={styles.commentsContainer}>
                <h2>Deixe o seu comentário</h2>

                <form>
                    <Textarea placeholder="Digite o seu comentário..." />
                    <button className={styles.button}>Enciar comentário</button>
                </form>
            </section>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({params}) =>{
    const id = params?.id as string;

    const docRef = doc(db, "tarefas", id);

    const snapshot = await getDoc(docRef);

    if(snapshot.data() === undefined){
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }
    
    if(!snapshot.data()?.public){
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }

    const miliseconds = snapshot.data()?.create?.seconds * 1000;

    const task = {
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        create: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id,
    }

    console.log(task);
    
    return{
        props: {
            item: task,
        },
    };
};