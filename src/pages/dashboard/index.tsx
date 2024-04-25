"use client"
import { GetServerSideProps } from 'next';
import styles from './styles.module.css';
import Head from "next/head";
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';

import { getSession } from 'next-auth/react';
import { Textarea } from '../../components/textarea';
import { FiShare } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

import { db } from '../../services/firebaseConnection';

import { addDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

interface HomeProps{
    user:{
        email: string; 
    }
}

interface TaskProps{
    id: string;
    created: Date;
    public: boolean;
    tarefa: string;
    user: string;
}

export default function Dashboard({ user }: HomeProps){
    const [input, setInput] = useState("");
    const [publicTask, setPublicTask] = useState(false);
    const [tasks, setTasks] = useState<TaskProps[]>([]);
console.log(user.email);

    useEffect(() =>{
        async function loadTarefas() {
            const tarefasRef = collection(db, "tarefas")
            const q = query(
                tarefasRef, 
               orderBy("create", "desc"),
              where("user", "==", user?.email)
            );

            onSnapshot(q, (snapshot) => {
                let lista = [] as TaskProps[];

                snapshot.forEach((doc)=> {
                    lista.push({
                        id: doc.id,
                        tarefa: doc.data().tarefa,
                        created: doc.data().create,
                        user: doc.data().user,
                        public: doc.data().public
                    })
                });
             setTasks(lista);   
            })
        }

        loadTarefas();
    }, [user?.email]);

    function handleChangePublic(event: ChangeEvent<HTMLInputElement>){
        setPublicTask(event.target.checked)
    }

    async function handleRegisterTask(event: FormEvent){
        event.preventDefault(); //prevenir reload da página
        
        if(input === "") return;

        try {
            await addDoc(collection(db, "tarefas"),{
                tarefa: input,
                create: new Date(),
                user: user?.email,
                public: publicTask,
            });

            setInput("")
            setPublicTask(false);

        } catch (err) {
            console.log(err);
        }
    }

    return(
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>

           <main className={styles.main}>
            <section className={styles.content}>
                <div className={styles.contentForm}>
                    <h1 className={styles.title}>Qual é a sua tarefa?</h1>

                    <form onSubmit={handleRegisterTask}>
                        <Textarea
                        placeholder="Digite qual sua tarefa..."
                        value={input}
                        onChange={(event:ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                        />
                        <div className={styles.checkboxArea}>
                            <input 
                            type="checkbox"
                            className={styles.checkbox}
                            checked={publicTask}
                            onChange={handleChangePublic}
                            />
                            <label>Deixar tarefa pública?</label>
                        </div>
                        <button className={styles.button} type='submit'>Registrar</button>
                    </form>
                </div>
            </section>

            <section className={styles.taskContainer}>
                <h1>Minhas tarefas</h1>

              {tasks.map((item) => (
                  <article key={item.id} className={styles.task}>
                 {item.public && (
                     <div className={styles.tagContainer}>
                     <label className={styles.tag}>PUBLICO</label>
                     <button className={styles.shareButton}>
                         <FiShare
                           size={22}
                           color="#3183ff"
                         />
                     </button>
                 </div>
                 )}

                  <div className={styles.taskContent}>
                      <p>{item.tarefa}</p>
                      <button className={styles.trashButton}>
                          <FaTrash
                            size={24}
                            color="#ea3140"
                          />
                      </button>
                  </div>
              </article>
              ))}

            </section>
           </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req}) =>{
    const session = await getSession({req});

    if(!session?.user){
        return{
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return{
        props:{
            user:{
                email: session?.user?.email,
            },
        },
    }
};