import React from 'react';
import {
    useQuery,
    gql
} from "@apollo/client";
import {LOC} from '../components/LOCperLanguage'

const QUERY = gql`
query{
    user(login: "JeRimes") {
    login
    avatarUrl
    bio
    name
    following {
      totalCount
    }
    followers {
        totalCount
    }
    commitComments {
      totalCount
    }
    repositories(first: 10) {
        nodes {
          defaultBranchRef {
            target {
              ... on Commit {
                id
                history(first: 10) {
                  totalCount
                }
              }
            }
          }
        }
      }

  }
}
`;



export default function DivTotalActivity() {

    const { loading, error, data } = useQuery(QUERY);
    if (loading) return <p>loading</p>;
    if (error) return <p>error</p>;
    const GetNodes = data.user.repositories.nodes;
    const nbRepo = GetNodes.length;
    var NbTotalCommit = 0
    GetNodes.map((item, i) => {   
      NbTotalCommit=NbTotalCommit+item.defaultBranchRef.target.history.totalCount;
    }
    );
    return (
        <div>
            <p>{data.user.login}</p>

            <div className="block-total-activity">
                <img src={data.user.avatarUrl} alt="img-user-git" />
                <div className="grey">
                    <p>Commits</p>
                    <p>{NbTotalCommit}</p>
                </div>
                <div className="grey">
                    <p>Repos</p>
                    <p>{nbRepo}</p>
                </div>
                <div className="grey">
                    <p>Lines of code</p>
                    <p>{LOC}</p>
                </div>
                <div className="green-light">
                    <p>Followers</p>
                    <p>{data.user.followers.totalCount}</p>
                </div>
                <div className="green-light">
                    <p>Following</p>
                    <p>{data.user.following.totalCount}</p>
                </div>
                <div className="green">
                    <a href="/">Refresh</a>
                </div>
            </div>
        </div>
    )
}
