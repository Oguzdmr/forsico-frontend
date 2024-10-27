const config = require("../../config");

class List {
    async getList(token, workspaceId, listId) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.boardApiBaseUrl}/list/${listId}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching list:', error);
            throw error;
        }
    }

    async deleteList(token, workspaceId, listId) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.boardApiBaseUrl}/list/${listId}?=${workspaceId}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error deleting list:', error);
            throw error;
        }
    }

    async createList(token, workspaceId, name, description, boardId, color) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            name: name,
            description: description,
            boardId: boardId,
            color:color
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.boardApiBaseUrl}/list`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error creating list:', error);
            throw error;
        }
    }

    async updateList(token, workspaceId, listId, name) {
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
            const response = await fetch(`${config.boardApiBaseUrl}/list/${listId}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating list:', error);
            throw error;
        }
    }

    async getListsOfBoard(token, workspaceId, boardId) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.boardApiBaseUrl}/list/getlistsofboard/${boardId}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching lists of board:', error);
            throw error;
        }
    }
}

export default List;