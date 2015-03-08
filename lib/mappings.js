/*
 * The MIT License (MIT)
 *
 * Copyright (c) Mario Verbelen <mario@verbelen.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// default mappings
var mappings = {
  "cpuStats":  {
    "properties": {
      "@timestamp":    {
        "type":   "date",
        "format": "dateOptionalTime"
      },
      "hostname":      {
        "type": "string"
      },
      "cpuGuest":      {
        "type": "short"
      },
      "cpuGuest_nice": {
        "type": "short"
      },
      "cpuIdle":       {
        "type": "short"
      },
      "cpuIowait":     {
        "type": "short"
      },
      "cpuIrq":        {
        "type": "short"
      },
      "cpuNice":       {
        "type": "short"
      },
      "cpuSoftirq":    {
        "type": "short"
      },
      "cpuSteal":      {
        "type": "short"
      },
      "cpuSystem":     {
        "type": "short"
      },
      "cpuUser":       {
        "type": "short"
      }
    }
  },
  "loadStats": {
    "properties": {
      "@timestamp": {
        "type":   "date",
        "format": "dateOptionalTime"
      },
      "hostname":   {
        "type": "string"
      },
      "load_1":     {
        "type": "double"
      },
      "load_15":    {
        "type": "double"
      },
      "load_5":     {
        "type": "double"
      },
      "type":       {
        "type": "string"
      }
    }
  },
  "memStats":  {
    "properties": {
      "@timestamp":     {
        "type":   "date",
        "format": "dateOptionalTime"
      },
      "hostname":       {
        "type": "string"
      },
      "memActive":      {
        "type": "long"
      },
      "memApps":        {
        "type": "long"
      },
      "memBuffers":     {
        "type": "long"
      },
      "memCached":      {
        "type": "long"
      },
      "memCommited":    {
        "type": "long"
      },
      "memFree":        {
        "type": "long"
      },
      "memKernelCache": {
        "type": "long"
      },
      "memMapped":      {
        "type": "long"
      },
      "memPageTables":  {
        "type": "long"
      },
      "memSwapCached":  {
        "type": "long"
      },
      "memSwapFree":    {
        "type": "long"
      },
      "memSwapUsed":    {
        "type": "long"
      },
      "memTotal":       {
        "type": "long"
      },
      "type":           {
        "type": "string"
      }
    }
  },
};
module.exports = mappings;