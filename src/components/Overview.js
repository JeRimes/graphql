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
    // const { loading, error, data } = useQuery(QUERY);
    // if (loading) return <p>loading</p>;
    // if (error) return <p>error</p>;


    return (
        <div>
            <canvas id="bar-chart" width="800" height="450"></canvas>
        </div>
    )
}
