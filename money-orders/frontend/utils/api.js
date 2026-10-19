export async function apiRequest(url, method = "GET", body = null){
    const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        ...(body && {body: JSON.stringify(body)})
    });

    const data = response.json();

    if(!response.ok){
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}