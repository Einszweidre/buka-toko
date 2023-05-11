module.exports = function (number) {
    return (number).toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });
} 