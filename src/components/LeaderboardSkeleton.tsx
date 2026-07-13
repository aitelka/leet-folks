import ChamferFrame from "./ChamferFrame";

export default function LeaderboardSkeleton() {
  return (
    <div className="leaderboardContainer" id="leaderboardContainer">
      <div className="podiumContainer">
        {[
          { place: "secondPlace", avatarSize: 120, nameWidth: 110, loginWidth: 75, levelWidth: 60 },
          { place: "firstPlace", avatarSize: 160, nameWidth: 130, loginWidth: 80, levelWidth: 65 },
          { place: "thirdPlace", avatarSize: 110, nameWidth: 100, loginWidth: 70, levelWidth: 55 },
        ].map(({ place, avatarSize, nameWidth, loginWidth, levelWidth }) => (
          <div className={`podiumPlace ${place} skeletonCard`} key={place}>
            <ChamferFrame />
            <div className="podiumAvatarContainer">
              <div className="podiumAvatar skeletonBlock" style={{ width: avatarSize, height: avatarSize }} />
            </div>
            <span className="podiumName skeletonBlock" style={{ width: nameWidth, height: "1em" }} />
            <span className="podiumLogin skeletonBlock" style={{ width: loginWidth, height: "1em" }} />
            <span className="podiumLevel skeletonBlock" style={{ width: levelWidth, height: "1em" }} />
          </div>
        ))}
      </div>

      <div className="leaderboardList">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="leaderboardItem skeletonItem" key={index}>
            <div className="leaderboardRank">
              <span className="skeletonBlock" style={{ width: 26, height: "1em" }} />
            </div>
            <div className="leaderboardAvatar skeletonBlock" />
            <div className="leaderboardItemInfo">
              <span className="leaderboardItemName skeletonBlock" style={{ width: 170, height: "1em", marginBottom: "0.4rem" }} />
              <span className="leaderboardItemLogin skeletonBlock" style={{ width: 110, height: "1em" }} />
            </div>
            <div className="leaderboardItemLevel skeletonBlock" style={{ width: 80, height: "1em" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
