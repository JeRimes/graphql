import React from 'react';
import {
    useQuery,
    gql
} from "@apollo/client";

const QUERY = gql`
query{
    user(login: "JeRimes") {
    login
    avatarUrl
    bio
    following {
      totalCount
    }
    name
    commitComments {
      totalCount
    }
    repositories {
      totalCount
    }
  }
}
`;

export default function DivOverview() {
    const { loading, error, data } = useQuery(QUERY);
    if (loading) return <p>loading</p>;
    if (error) return <p>error</p>;
    return (
        <div>
            <p>{data.user.login}</p>

            <div className="block-total-activity">
                <img src={data.user.avatarUrl} alt="img-user-git" />
                <div className="grey">
                    <p>Commits</p>
                    <p>{data.user.commitComments.totalCount}</p>
                </div>
                <div className="grey">
                    <p>Repos</p>
                    <p>0</p>
                </div>
                <div className="grey">
                    <p>Lines of code</p>
                    <p>0</p>
                </div>
                <div className="green-light">
                    <p>Followers</p>
                    <p>{data.user.following.totalCount}</p>
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
