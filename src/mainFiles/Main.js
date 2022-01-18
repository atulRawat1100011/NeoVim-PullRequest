import React, { useEffect, useState, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';
import loader from '../loader.gif';
import _ from 'lodash'; 
let page = 1;

const Main = () => {
const [pullRequests, setPullRequests] = useState([]);
const [loading, setLoading] = useState(!1)

const fetchPost =  useCallback(async () => {
        const res = await fetch(`https://api.github.com/repos/neovim/neovim/pulls?page=${page}`,{
            headers:{
                'Accept':'application/vnd.github.v3+json',
                'Authorization': process.env.REACT_APP
            }
        });
        const json = await res.json();
        if(json.length > 0){
            setPullRequests(value => ([...value, ...json ]))
            page += 1;
            setLoading(!0)
        }else{
            setLoading(!1)
        }
}, [setPullRequests])
console.log(pullRequests);
const layout = () => (
    <div className="git-pull-requests">
         <h2>NeoVim PullRequest</h2>
                <Virtuoso
                style={{height:'500px'}}
                totalCount={1}
                data={pullRequests}
                endReached={fetchPost}
                itemContent={(i, p) => (<>
                  {!_.isEmpty(p) &&
                    <div key={i+Date.now()} className="pull-requests">   
                        <div className={`pull-request-${p.id}`}>

                            
                        <table className="pull-info" border="10px" >
                        <tr>
               <th className="head" >Title</th>
              
               <th className="head">Base Branch</th>
              
               
               <th className="head">Author Branch</th>
              
               
                <th className="head">Author</th>
               
               
               <th className="head">Created at</th>
               
               
               <th className="head">Reviews</th>
             

               <th className="head">Labels</th>
            </tr>
                 <tr>
                 <td className="xyzK"> <center><a href={p.url} target="_blank"> {p.title}</a></center></td>
                 <td> <center>{p.base.repo.default_branch}</center></td>
                 <td><center>{p.author_association}</center></td>
                 <td><center>{_.isEmpty(p.head.user) ? '' :p.head.user.login}</center></td>
                 <td><center>{p.base.repo.created_at}</center></td>
                 <td><center>{p.number}</center></td>
                 <td><center>{p.labels.length > 0 ? p.labels[0].name : ''}</center></td>

                     </tr>            
                            </table>
                        </div>
                    </div>}
                </>)}
                components={{
                    Footer: () => (
                    <span style={{textAlign: 'center', display: 'block'}}>
                      {loading &&  <img src={loader} height={200} width={200} />}
                    </span>
                    )
                }}
                />
      </div>
)

useEffect(() => {
    fetchPost();
})

    return (
       <main className="git">
         {layout()}
       </main>
    );
};

export default Main;