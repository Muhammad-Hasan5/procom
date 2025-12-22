export function normalizetasksStats(stats) {
    const result = {
        total: 0,
        todo: 0,
        "in-progress": 0,
        review: 0,
        complete: 0,
    };
    for (const item of stats) {
        switch (item._id) {
            case "todo":
                result.todo = item.count;
                break;
            case "in-progress":
                result.todo = item.count;
                break;
            case "review":
                result.todo = item.count;
                break;
            case "complete":
                result.todo = item.count;
                break;
        }
        result.total += item.count;
    }
    return result;
}
