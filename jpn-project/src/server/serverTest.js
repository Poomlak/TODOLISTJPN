import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ServerTest() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        // Assuming your backend runs on http://localhost:5000
        axios.get('http://localhost:5000/server/serverTest')
            .then(response => {
                setMembers(response.data);
            })
            .catch(error => {
                console.error("Error fetching members::", error);
            });
    }, []);

    return (
        <div>
            <h1>Member List</h1>
            {members.length > 0 ? (
                members.map(member => (
                    <div key={member.member_id}>
                        <p>
                            <strong>ID:</strong> {member.member_id}<br />
                            <strong>First Name:</strong> {member.member_fname}<br />
                            <strong>Last Name:</strong> {member.member_lname}<br />
                        </p>
                    </div>
                ))
            ) : (
                <p>No members found.</p>
            )}
        </div>
    );
}

export default ServerTest;
