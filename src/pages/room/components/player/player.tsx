import React from "react";
import { BaseProps } from "../../../../types/types";
import { QNTrack, QNRemoteTrack } from "qnweb-rtc";
import "./player.less";
import { Avatar } from "antd";
import {
  AudioOutlined,
  AudioMutedOutlined,
  VideoCameraOutlined,
  UserAddOutlined,
  DesktopOutlined,
  WechatOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { isScreenVideo } from "../../../../utils";

interface PlayerProps extends BaseProps {
  tracks: QNTrack[];
  userid: string;
  isScreen?: boolean
}

interface PlayerState {}

export default class Player extends React.Component<PlayerProps, PlayerState> {
  play = (ref, track) => {
    if (ref) {
      if (track.mediaElement && track.mediaElement.parentElement === ref)
        return;
      track.play(ref);
    }
  };
  private videoMuted(tracks: QNTrack[]) {
    const cameraTracks = tracks.filter(track => track.isVideo() && !isScreenVideo(track.tag));
    if(!cameraTracks.length) {
      return true;
    }
    let muted = tracks.some(
      (track) => !isScreenVideo(track.tag) && track.isVideo() && track.isMuted()
    );
    return muted;
  }
  render() {
    const { tracks, userid, isScreen } = this.props;
    const muted = this.videoMuted(tracks) && !isScreen;
    const audioTrack = tracks.find((t) => t.isAudio() && !t.isMuted());
    return (
      <div className="play-wrapper">
        <div className="play-content" style={{ height: "100%" }}>
          {muted && (
            <div>
              <Avatar
                size={64}
                src="http://cdn.mfspa.cc/resources/images/avatar.jpeg"
              ></Avatar>
              <div className="user-control">
                <span style={{ cursor: "pointer" }}>
                  {audioTrack ? <AudioOutlined /> : <AudioMutedOutlined />}
                </span>

                <span className="m-l-xs">{userid}</span>
              </div>
            </div>
          )}
          {tracks.map((track) => {
            if (track.isVideo()) {
              return track ? (
                <>
                  <div
                    hidden={muted}
                    ref={(ref) => this.play(ref, track)}
                    className="play-container"
                  ></div>
                </>
              ) : (
                <></>
              );
            }
            return track ? (
              <div ref={(ref) => this.play(ref, track)}></div>
            ) : (
              <></>
            );
          })}
        </div>
      </div>
    );
  }
}
