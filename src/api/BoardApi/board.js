const config = require("../../config");

class Board {
    async getBoard(token, workspaceId, boardId) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.boardApiBaseUrl}/board/${boardId}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching board:', error);
            throw error;
        }
    }

    async deleteBoard(token, workspaceId, boardId) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.boardApiBaseUrl}/board/${boardId}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error deleting board:', error);
            throw error;
        }
    }

    async createBoard(token, workspaceId, name, description) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            name: name,
            description: description
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.boardApiBaseUrl}/board`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error creating board:', error);
            throw error;
        }
    }

    async updateBoard(token, workspaceId, boardId, name) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            name: name
        });

        const requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.boardApiBaseUrl}/board/${boardId}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating board:', error);
            throw error;
        }
    }

    async getBoardsOfWorkspace(token, workspaceId) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.boardApiBaseUrl}/board/getboardsofworkspace`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching boards of workspace:', error);
            throw error;
        }
    }

    async addMemberToBoard(token, workspaceId, boardId, userId) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            userId: userId
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.boardApiBaseUrl}/board/addMemberToBoard/${boardId}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error adding member to board:', error);
            throw error;
        }
    }

    //TODO GETBOARDMEMBERS EKLENECEK
}

export default Board;