export const formatGameTime = (dateStr, timeZone) =>
{
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone,
        hour12: false
    });
};

export const formatGameDate = (dateStr, timeZone) =>
{
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone
    });
};

export const isGameInFuture = (dateStr) =>
{
    return new Date(dateStr) > new Date();
};
