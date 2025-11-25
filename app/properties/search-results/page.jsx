'use client';

import {useState, useEffect} from "react";
import {useSearchParams} from "next/navigation";

import {FaArrowAltCircleLeft} from "react-icons/fa";
import PropertyCard  from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import PropertySearchForm from "@/components/PropertySearchForm";

const SearchResultsPage = () => {

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const location = searchParams.get('location') || '';
    const propertyType = searchParams.get('propertyType') || 'All';

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const result = fetch(`/api/properties/search?location=${encodeURIComponent(location)}&propertyType=${encodeURIComponent(propertyType)}`);
                if ((await result).status === 200) {
                    const data = await (await result).json();
                    setProperties(data);
                    setLoading(false);
                } else {
                    setProperties([]);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchSearchResults();
    }, [location, propertyType]);

    return (
        <>
            <section className="bg-blue-700 py-4">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
                    <PropertySearchForm />
                </div>
            </section>
            {(loading ? (<Spinner loading={loading}/>) : (

                <section className="px-4 py-6">
                    <div className="container-xl lg:container m-auto px-4 py-6">
                        <Link href={'/properties'}
                              className="inline-flex items-center text-blue-500 hover:underline mb-3">
                            <FaArrowAltCircleLeft/> Back to Properties
                        </Link>
                        <h1 className="text-2xl mb-4">Search Results</h1>
                        {
                            properties.length === 0 ?
                                (<p>No search results found.</p>) :
                                (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {
                                            properties.map((property) => (
                                                <PropertyCard
                                                    key={property._id}
                                                    property={property}
                                                />
                                            ))
                                        }
                                    </div>
                                )
                        }
                    </div>
                </section>
            ))}
        </>
    );

};

export default SearchResultsPage;