import { useEffect, useState } from 'react';
import { useSearchFile } from './useAdditionalDataQuery';

export function useMultipleFileSearch(fileableType, fileableId) {
    const logoQuery = useSearchFile('logo', fileableType, fileableId);
    const mediaQuery = useSearchFile('media_files', fileableType, fileableId);
    const otherQuery = useSearchFile('other', fileableType, fileableId);
    const specificQuery = useSearchFile('specification_file', fileableType, fileableId);

    const [results, setResults] = useState({
        logoFiles: null,
        mediaFiles: null,
        otherFiles: null,
        specificFiles: null,
    });

    const isLoading = logoQuery.isLoading || mediaQuery.isLoading || otherQuery.isLoading || specificQuery.isLoading;

    useEffect(() => {
        setResults({
            logoFiles: logoQuery.data,
            mediaFiles: mediaQuery.data,
            otherFiles: otherQuery.data,
            specificFiles: specificQuery.data,
        });
    }, [logoQuery.data, mediaQuery.data, otherQuery.data, specificQuery.data]);

    return { ...results, isLoading };
}
