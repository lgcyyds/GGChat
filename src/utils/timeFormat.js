export const formatDate = (date) => {
    const prevTime = Date.parse(new Date(date))
    const curTime = new Date().getTime()
    const interval = (curTime - prevTime) / 1000//经过了多少秒
    if (interval < 0) {
        return '刚刚'
    } else if (interval > 60 * 60 * 24) {
        return getformatTime(date)
    } else if (interval > 60 * 60) {
        return Math.round(interval / 3600) + '小时前'
    } else if (interval > 60) {
        return Math.round(interval / 60) + '分钟前'
    } else {
        return '刚刚'
    }
}
function getformatTime(date) {
    let time = new Date(date)
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let day = time.getDate()
    let hour = time.getHours()
    let min = time.getMinutes()
    return `${year}-${month}-${day} ${hour}:${min}`
}