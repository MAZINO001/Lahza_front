import { useState } from 'react';
export const useSubmitProtection = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const startSubmit = () => {
        if (isSubmitting) return false;
        setIsSubmitting(true);
        return true;
    };

    const endSubmit = () => {
        setIsSubmitting(false);
    };

    return { isSubmitting, startSubmit, endSubmit };
};