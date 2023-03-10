// ===========================================================
//  날짜/시간 유틸리티
// ===========================================================
// - 작성일: 2023. 03. 09.
// - 작성자: 홍사민
// ===========================================================
import { Duration, UnixTime } from "../common-types/date";

export default class DateUtil {

    /**
     * 현재로부터 지정 기간만큼 지난 날짜의 Unix Time
     */
    public static getUnixTimeFromNow(duration: Duration): UnixTime {
        const secs = 
            (duration.day  ?? 0) * 86400000 + 
            (duration.hour ?? 0) * 3600000 +
            (duration.min  ?? 0) * 60000 +
            (duration.sec  ?? 0) * 1000;
        
        return Date.now() + secs;
    }
}