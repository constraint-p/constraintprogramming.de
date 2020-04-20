// This file
//
// - was copied from:
//
// https://github.com/fb55/bitfield
//
// - under the following licence:
//
// The MIT License (MIT)
//
// Copyright (c) 2013 Felix Böhm
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

function getByteSize (num) {
    let out = num >> 3
    if (num % 8 !== 0) out++
    return out
}

export class BitField {
    constructor (data = 0, opts) {
        const grow = opts != null && opts.grow
        this.grow = (grow && isFinite(grow) && getByteSize(grow)) || grow || 0
        this.buffer = typeof data === 'number' ? new Uint8Array(getByteSize(data)) : data
    }

    get (i) {
        const j = i >> 3
        return (j < this.buffer.length) &&
            !!(this.buffer[j] & (128 >> (i % 8)))
    }

    set (i, b = true) {
        const j = i >> 3
        if (b) {
            if (this.buffer.length < j + 1) {
                const length = Math.max(j + 1, Math.min(2 * this.buffer.length, this.grow))
                if (length <= this.grow) {
                    const newBuffer = new Uint8Array(length)
                    newBuffer.set(this.buffer)
                    this.buffer = newBuffer
                }
            }
            // Set
            this.buffer[j] |= 128 >> (i % 8)
        } else if (j < this.buffer.length) {
            // Clear
            this.buffer[j] &= ~(128 >> (i % 8))
        }
    }
}

if (typeof module !== 'undefined') module.exports = BitField
