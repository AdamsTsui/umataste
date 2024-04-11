/*
 * Copyright (C) 2023 zheng qian. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Live buffer latency synchronizer by increasing HTMLMediaElement.playbackRate
class LiveLatencySynchronizer {

    private _media_element: HTMLMediaElement | null = null;

    private e?: any = null;

    public constructor(media_element: HTMLMediaElement) {
        this._media_element = media_element;

        this.e = {
            onMediaTimeUpdate: this._onMediaTimeUpdate.bind(this),
        };

        this._media_element.addEventListener('timeupdate', this.e.onMediaTimeUpdate);
    }

    public destroy(): void {
        if (this._media_element) {
            this._media_element.removeEventListener('timeupdate', this.e.onMediaTimeUpdate);
        }
    }

    private _onMediaTimeUpdate(e: Event): void {
        console.log('_onMediaTimeUpdate。。。')
        if (!this._media_element) {
            return;
        }

        /*let latency: number = 0
        const buffered = this._media_element.buffered;
        const current_time = this._media_element.currentTime;

        if (buffered.length == 0) {
            return;
        }

        const buffered_end = buffered.end(buffered.length - 1);
        latency =  buffered_end - current_time;

        if (latency > 0.8) {
            this._media_element.currentTime = buffered_end;
        }*/

        const latency = this._getCurrentLatency();

        if (latency > 2) {
            this._media_element.playbackRate = 2;
        } else if (latency > 0.8) {
            // do nothing, keep playbackRate
        } else if (this._media_element.playbackRate !== 1 && this._media_element.playbackRate !== 0) {
            this._media_element.playbackRate = 1;
        }
    }

    private _getCurrentLatency(): number {
        if (!this._media_element) {
            return 0;
        }

        const buffered = this._media_element.buffered;
        const current_time = this._media_element.currentTime;

        if (buffered.length == 0) {
            return 0;
        }

        const buffered_end = buffered.end(buffered.length - 1);
        return buffered_end - current_time;
    }

}

export default LiveLatencySynchronizer;
