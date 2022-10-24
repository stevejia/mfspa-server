import { Col, Row } from "antd";
import React from "react";
import { BaseProps } from "../../../../types/types";
import { QNTrack } from "qnweb-rtc";
import "./index.less";
import Player from "./player";
import { isScreenVideo } from "../../../../utils";

interface PlayersProps extends BaseProps {
  userid: string;
  tracks: Array<any>;
  subscribedTracks: { [key: string]: any };
}

interface PlayersState {}

export default class Players extends React.Component<
  PlayersProps,
  PlayersState
> {
  componentDidMount(): void {}

  private allVideoTrackMuted() {
    const { tracks, subscribedTracks } = this.props;
    let muted = this.videoMuted(tracks || []);
    Object.values(subscribedTracks).forEach((remoteTracks) => {
      muted = muted && this.videoMuted(remoteTracks || []);
    });
    return muted;
  }

  private videoMuted(tracks: QNTrack[]) {
    const muted = tracks.some(
      (track) => !isScreenVideo(track.tag) && track.isVideo() && track.isMuted()
    );
    return muted;
  }

  private getSpan(subscribedTracks) {
    // const {subscribedTracks} = this.props;
    const subscribeLen = Object.keys(subscribedTracks).length;

    let className = "";
    let span = 8;
    if (subscribeLen === 0) {
      span = 24;
    }
    if (subscribeLen === 1) {
      span = 12;
    }
    if (subscribeLen > 2 && subscribeLen < 6) {
      className = "user-two-line";
    }
    if (subscribeLen >= 6) {
      className = "user-three-line";
    }
    return { className, span };
  }

  getScreenVideo() {
    let screenVideo = null;
    let _userid = null;
    const { tracks = [], userid, subscribedTracks } = this.props;
    const { track, userid: usrId } = this._getScreenVideo(tracks, userid);
    screenVideo = track;
    _userid = usrId;
    Object.keys(subscribedTracks).forEach((t) => {
      if (!screenVideo) {
        const { track: _track, userid: _usrId } = this._getScreenVideo(
          subscribedTracks[t],
          t
        );
        screenVideo = _track;
        _userid = _usrId;
      }
    });
    return { screenVideo, shareUserId: _userid };
  }

  _getScreenVideo(tracks, userid) {
    const track = tracks.find((track) => isScreenVideo(track.tag));
    if (track) {
      debugger;
      return { track, userid };
    }
    return { track: null, userid: null };
  }

  render() {
    const { tracks = [], userid, subscribedTracks } = this.props;
    const playerTracks = tracks.filter((t) => !isScreenVideo(t.tag));
    const { screenVideo, shareUserId } = this.getScreenVideo();
    let { className, span } = this.getSpan(subscribedTracks);
    if (screenVideo) {
      span = 24;
    }
    const screenUserId = screenVideo?.userID;
    console.log("subscribedTracks", subscribedTracks);
    return (
      <div className="player-wrapper">
        {screenVideo && (
          <div className="screen-video">
            <Player
              isScreen
              userid={shareUserId}
              tracks={[screenVideo]}
            ></Player>
          </div>
        )}
        <Row
          className={`player-container${screenVideo ? " display-block" : ""}`}
        >
          {screenUserId !== userid && <Col span={span} className={className}>
            {playerTracks?.length > 0 &&  (
              <Player userid={userid} tracks={playerTracks}></Player>
            )}
          </Col>}
          {Object.keys(subscribedTracks).map((item) => {
            const rTracks =
              subscribedTracks[item].filter((t) => !isScreenVideo(t.tag)) || [];
            return (
              screenUserId !== item && <Col key={item} span={span} className={className}>
                {rTracks?.length > 0 &&  (
                  <Player userid={item} tracks={rTracks}></Player>
                )}
                {/* <UserPlayer tracks={rTracks} userid={item}></UserPlayer> */}
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}
