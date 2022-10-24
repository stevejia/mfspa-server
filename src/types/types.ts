import { NavigateFunction } from "react-router-dom";

export interface BaseProps {
    navigate?: NavigateFunction;
    location?: Location;
}

export interface MeetingInfo {
    startTime: number;
    endTime: number;
    title: string;
    status: MEETING_STATUS;
    meetingId: string;
    hover?: boolean
}

export enum MEETING_STATUS {
    NOT_STARTED = 0,
    STARTED
}


export enum RIGHT_TYPE {
    MEMBER_MANAGE = 0,
    CHAT
}

export interface meetingRtcConfig {
    appid: string;
    userid: string;
    meetingId: string;
    onChange: () => {};
}