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
            const response = await fetch(`${config.baseUrl}/list/${listId}`, requestOptions);
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
            const response = await fetch(`${config.baseUrl}/list/${listId}?=${workspaceId}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error deleting list:', error);
            throw error;
        }
    }

    async createList(token, workspaceId, name, description, boardId) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            name: name,
            description: description,
            boardId: boardId
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.baseUrl}/list`, requestOptions);
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
            const response = await fetch(`${config.baseUrl}/list/${listId}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating list:', error);
            throw error;
        }
    }

    async getListsOfBoard(token, workspaceId, listId) {
        const myHeaders = new Headers();
        myHeaders.append("x-workspace-id", workspaceId);
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${config.baseUrl}/list/getlistsofboard/${listId}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching lists of board:', error);
            throw error;
        }
    }
}

export default List;