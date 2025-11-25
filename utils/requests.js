const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

async function fetchProperties({showFeatured = false} = {}) {
    try {
        if (!apiDomain) {
            console.warn('API domain is not defined');
            return [];
        }
        const res = await fetch(`${apiDomain}/properties${showFeatured ? '/featured': ''}`, {cache: "no-store"});

        if (!res.ok) {
            throw new Error('Failed to fetch properties');
        }

        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchSingleProperty(id) {
    try {
        if (!apiDomain) {
            console.warn('API domain is not defined');
            return null;
        }
        const res = await fetch(`${apiDomain}/properties/${id}`);

        if (!res.ok) {
            throw new Error('Failed to fetch property');
        }

        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export {fetchProperties, fetchSingleProperty};