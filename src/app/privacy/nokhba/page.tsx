import type { Metadata } from "next";
import PolicyDocument, {
  Callout,
  DataTable,
  type DocSection,
} from "@/components/PolicyDocument";

export const metadata: Metadata = {
  title: "Nokhba Player privacy policy",
  description:
    "Privacy policy for the Nokhba Player media player for Android. No account: your playlists and credentials stay on your device.",
  alternates: { canonical: "/privacy/nokhba" },
};

const sections: DocSection[] = [
  {
    id: "on-device",
    title: "Information you provide, which stays on your device",
    body: (
      <>
        <p>
          To play anything, you supply your own source: an M3U or M3U8 playlist
          URL, a playlist file, an Xtream Codes portal with a username and
          password, or a Stalker portal with a MAC address. You may also build
          favorites and playlists, and the App records what you have watched so
          you can return to it.
        </p>
        <p>
          All of this is written to local storage on your device and is{" "}
          <strong>never transmitted to us</strong>. We operate no server that
          receives it. Specifically:
        </p>
        <ul>
          <li>
            Playlists, channel lists, favorites, watch history, and playlists
            you create are held in a private database inside the App’s own
            storage area, which other apps cannot read.
          </li>
          <li>
            Xtream portal usernames and passwords are encrypted with a key held
            in your device’s hardware-backed Android Keystore, and are excluded
            from Android cloud backup and device-to-device transfer so they
            cannot leave the device that way.
          </li>
          <li>The channel database is likewise excluded from cloud backup.</li>
        </ul>
      </>
    ),
  },
  {
    id: "automatic",
    title: "Information collected automatically",
    body: (
      <>
        <p>
          The App includes services from Google that collect data in the
          background. We see these only as aggregated reports; they are not
          linked to your name or to any account.
        </p>
        <DataTable
          caption="Third-party services in Nokhba Player, what each collects, and why"
          rows={[
            {
              service: "Google Analytics for Firebase",
              collects:
                "App opens and in-app events, session length, device model, operating system version, language, country derived from IP address, and a randomly generated app instance identifier",
              why: "To understand which features are used and where the App is failing people",
            },
            {
              service: "Firebase Crashlytics",
              collects:
                "Crash and error reports, including the stack trace, device model, operating system version, and App state at the moment of the crash",
              why: "To diagnose and fix crashes",
            },
            {
              service: "Firebase Cloud Messaging",
              collects: "A push notification token identifying your installation",
              why: "To deliver notifications, where you have allowed them",
            },
            {
              service: "Firebase Remote Config",
              collects:
                "Retrieves configuration settings. Sends device and App version details as part of the request",
              why: "To adjust settings without shipping an update",
            },
            {
              service: "Google AdMob",
              collects:
                "Advertising ID, IP address, ad impressions and interactions, and general device information",
              why: "To display advertising, which funds the App",
            },
          ]}
        />
        <p>
          Google processes this data as described in the{" "}
          <a
            href="https://policies.google.com/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Privacy Policy
          </a>
          . Further detail is available for{" "}
          <a
            href="https://firebase.google.com/support/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Firebase
          </a>{" "}
          and for{" "}
          <a
            href="https://support.google.com/admob/answer/6128543"
            rel="noopener noreferrer"
            target="_blank"
          >
            AdMob
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "advertising",
    title: "Advertising and your choices",
    body: (
      <>
        <p>
          The App shows advertising supplied by Google AdMob. Where required —
          including in the European Economic Area, the United Kingdom, and
          Switzerland — the App presents a consent form from Google’s User
          Messaging Platform before any personalised advertising is served, and
          records your answer. You may change that answer at any time, and you
          may withdraw consent you previously gave.
        </p>
        <p>
          Independently of the App, Android lets you limit ad tracking or delete
          your advertising identifier under <em>Settings → Privacy → Ads</em>.
          Doing so does not remove advertising, but it stops it being
          personalised.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Third parties you connect to through the App",
    body: (
      <>
        <p>
          When you play a stream, your device contacts that source{" "}
          <strong>directly</strong>. The traffic does not pass through any
          server of ours, and we have no visibility into it. The operator of
          that source will see your IP address and what you requested from them,
          and their own handling of that information is governed by their terms,
          not by this policy.
        </p>
        <p>
          This applies to any playlist provider, Xtream portal, or Stalker
          portal you configure, and to Twitch where you open a Twitch channel
          through the App. We have no relationship with any of these operators
          and do not endorse them.
        </p>
        <Callout label="We do not supply content" tone="warn">
          <p>
            Nokhba ships with no channels, no playlists, and no preconfigured
            providers. Everything you watch comes from a source you chose and
            entered yourself. You are responsible for ensuring you have the
            right to access it.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "retention",
    title: "Retention and deletion",
    body: (
      <>
        <p>
          Everything held on your device stays there until you remove it. You
          can delete individual playlists and history from within the App, clear
          all of it at once through{" "}
          <em>Android Settings → Apps → Nokhba → Storage → Clear data</em>, or
          remove it entirely by uninstalling the App.
        </p>
        <p>
          Analytics and crash data held by Google are retained according to
          Google’s own schedules, which for Firebase Analytics defaults to 14
          months. To have data associated with your installation deleted from
          those systems, contact us at the address below and include the date
          and approximate time of use, since we hold no identifier that would
          let us find you otherwise.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        The App is not directed at children under 13, and we do not knowingly
        collect personal information from them. Because playlists are
        user-supplied, the App cannot guarantee that a given source is free of
        material unsuitable for children; a filter is applied to obviously
        adult-labelled entries when a playlist is imported, but it is not a
        substitute for supervision. If you believe a child has provided us with
        personal information, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <>
        <p>
          Provider credentials are encrypted at rest using Android’s
          hardware-backed Keystore. The App’s data is stored in private
          application storage that other apps cannot access.
        </p>
        <p>
          Note that many IPTV portals are only reachable over unencrypted HTTP,
          and the App permits such connections so that those sources work at
          all. Where a source does not support HTTPS, the credentials and
          requests sent to it are not encrypted in transit. This is a property
          of the source you chose, and we recommend preferring providers that
          offer HTTPS.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>
          Depending on where you live, you may have the right to access,
          correct, delete, or port your personal data, to object to or restrict
          its processing, and to withdraw consent. Residents of the European
          Economic Area and the United Kingdom hold these rights under the GDPR;
          residents of California hold comparable rights under the CCPA,
          including the right not to be discriminated against for exercising
          them. We do not sell personal information.
        </p>
        <p>
          Because the App has no accounts, most data never reaches us, and what
          does is not linked to your identity. To exercise any of these rights,
          or to complain to a supervisory authority, use the contact address
          below.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as the App changes. The effective date at the
        top will be revised, and material changes will be signalled in the App
        or on its Google Play listing. Continuing to use the App after a change
        means you accept the revised policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about this policy or about your data can be sent to{" "}
        <a href="mailto:leetfolks@gmail.com">leetfolks@gmail.com</a>.
      </p>
    ),
  },
];

export default function NokhbaPrivacy() {
  return (
    <PolicyDocument
      slug="nokhba"
      sections={sections}
      meta={{
        kind: "Nokhba Player, on Google Play",
        title: "Nokhba Player",
        icon: "/apps/nokhba-icon.png",
        effective: "17 August 2026",
        updated: "17 August 2026",
        facts: [
          { label: "Package", value: "com.leetfolks.nokhba" },
          { label: "Platform", value: "Android" },
        ],
        intro: (
          <p>
            This policy explains what the Nokhba Android application (package{" "}
            <code>com.leetfolks.nokhba</code>, the “App”) does with information
            when you use it. The App is published by Leet Folks (“we”, “us”).
          </p>
        ),
        summary: (
          <>
            <p>
              Nokhba is a media player. It does not host, supply, or resell any
              channels, streams, or video content.
            </p>
            <p>
              There is no account and no sign-up. The playlists you add and any
              provider usernames and passwords you enter are stored only on your
              device — we never receive them and cannot see them.
            </p>
            <p>
              The App does send anonymous usage statistics, crash reports, and
              advertising data to Google. That is the only information that
              leaves your device to us or our providers.
            </p>
          </>
        ),
        note: (
          <p>
            Nokhba is published by Leet Folks. This policy covers the Android
            application only, and does not cover any third-party service you
            reach through it.
          </p>
        ),
      }}
    />
  );
}
