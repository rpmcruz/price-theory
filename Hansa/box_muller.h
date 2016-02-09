#ifndef BOX_MULLER_H
#define BOX_MULLER_H

// from:
// http://en.literateprograms.org/index.php?title=Special:DownloadCode/Box-Muller_transform_(C)&oldid=7011

/* The authors of this work have released all rights to it and placed it
in the public domain under the Creative Commons CC0 1.0 waiver
(http://creativecommons.org/publicdomain/zero/1.0/).

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Retrieved from: http://en.literateprograms.org/Box-Muller_transform_(C)?oldid=7011
*/

#include <stdlib.h>
#include <math.h>
#include <time.h>
#include <stdio.h>

double rand_normal(double mean, double stddev) {
    static double n2 = 0.0;
    static int n2_cached = 0;
    if (!n2_cached) {
        double x, y, r;
    do {
        x = 2.0*rand()/RAND_MAX - 1;
        y = 2.0*rand()/RAND_MAX - 1;

        r = x*x + y*y;
    } while (r == 0.0 || r > 1.0);
        {
        double d = sqrt(-2.0*log(r)/r);
    double n1 = x*d;
    n2 = y*d;
        double result = n1*stddev + mean;
        n2_cached = 1;
        return result;
        }
    } else {
        n2_cached = 0;
        return n2*stddev + mean;
    }
}

#endif // BOX_MULLER_H
