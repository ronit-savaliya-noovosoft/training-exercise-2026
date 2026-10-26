export async function apiRequest(url, method = "GET", body = null){
    try{
        const response = await fetch(url, {
            method,
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            ...(body && {body: JSON.stringify(body)})
        });

        const data = await response.json();

        if(response.status === 401){
            window.location.href = '../../../error/pages/html/unauthorize.html';
        }

        if(!response.ok){
            throw new Error(data.message || "Something went wrong");
        }

        return data;
    }
    catch (e){
        throw e;
    }
}