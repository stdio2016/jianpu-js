function lessThan(a, b) {
    return a.n < b.n;
}
function heappush(arr, value) {
    var i = arr.length;
    arr.push(value);
    while (i > 0) {
        var p = (i-1)>>1;
        if (lessThan(value, arr[p])) {
            arr[i] = arr[p];
            i = p;
        } else break;
    }
    arr[i] = value;
}
function heappop(arr) {
    var ans = arr[0];
    var value = arr.pop();
    var n = arr.length;
    if (n === 0) return ans;
    arr[0] = value;
    var i = 0;
    var a = i*2+1;
    while (a < n) {
        var b = a+1;
        if (b < n && lessThan(arr[b], arr[a])) {
            a = b;
        }
        if (lessThan(arr[a], value)) {
            arr[i] = arr[a];
            i = a;
        } else break;
        a = i*2+1;
    }
    arr[i] = value;
    return ans;
}
/**
 * @return {Generator<{n:bigint,tau:bigint},void>}
 * @param {bigint} prime
 * @param {Generator<{n:bigint,tau:bigint},void>?} stream
 */
function *hcp(prime, stream) {
    if (!stream) {
        var n = 1n;
        for (var i = 0n; ; i++) {
            yield {n: n, tau: i+1n};
            n *= prime;
        }
        // Infinite generator, here is unreachable
    }
    var sn = stream.next();
    if (sn.done !== false) return;
    var {n, tau} = sn.value;
    const pq = [{n: n, tau: tau, prevtau: tau, pow: 1n}];
    var taumark = 0;
    for (;;) {
        var obj = heappop(pq);
        var {n, tau, prevtau, pow} = obj;
        if (pow === 1n) {
            var sn = stream.next();
            if (sn.done === false) {
                const {n: n2, tau: tau2} = sn.value;
                heappush(pq, {n: n2, tau: tau2, prevtau: tau2, pow: 1n});
            }
        }
        heappush(pq, {n: n * prime, tau: prevtau * (pow+1n), prevtau: prevtau, pow: (pow+1n)});
        if (tau > taumark) {
            yield {n: n, tau: tau};
            taumark = tau;
        }
    }
}
function *primeGen() {
    for (var p = 2n; ; p++) {
        var flag = true;
        for (var i = 2n; i * i <= p; i++) {
            if (p % i === 0n) {
                flag = false;
                break;
            }
        }
        if (flag) yield p;
    }
}
function restartableGen(gen) {
    var saved = [];
    return (function make(n) {
        return {
            next(arg) {
                if (n >= saved.length) saved.push(gen.next(arg));
                return saved[n++];
            },
            restart() {
                return make(0);
            },
            [Symbol.iterator]() {
                return this;
            },
        }
    })(0);
}
function *hcn() {
    var primes = primeGen();
    var oldn = 0n;
    var oldgen = null;
    var newgen = null;
    for (var prime of primes) {
        if (oldgen && newgen) {
            for (var x of oldgen) {
                var y = newgen.next();
                if (y.done === false) {
                    if (y.value.n < x.n) {
                        break;
                    }
                }
                oldn = x.n;
                yield x;
            }
        }
        oldgen = newgen;
        newgen = restartableGen(hcp(prime, newgen && newgen.restart ? newgen.restart(): null));
        for (var x of newgen) {
            if (x.n > oldn) break;
        }
        if (oldgen) {
            yield x;
        }
    }
}
var gen = hcn();
console.log('n\thcn\ttau');
for (var i = 0; i < 5000; i++) {
    var sn = gen.next().value;
    console.log(`${i+1}\t${sn.n}\t${sn.tau}`);
}
