// Algebraic Data Types

import { match, P } from "ts-pattern";

const identity = <T>(x: T) => x

type GitHubUser = { kind: "GitHub", data: { login: string; id: number; avatar_url: string; } }
const GitHubUser = (data: { login: string; id: number; avatar_url: string; }): GitHubUser => ({ kind: "GitHub", data })
type SpotifyUser = { kind: "Spotify", data: { id: string; display_name: string; href: string; } }
type TwitterUser = { kind: "Twitter", data: { id: number; name: string; username: string; } }

type User = GitHubUser | SpotifyUser | TwitterUser

const parseUser = (maybeUser: unknown): User => match(maybeUser)
  .with({ login: P.string, id: P.number, avatar_url: P.string }, GitHubUser)
  // TODO.with(PATTERN, UserProvider)
  // TODO.with(PATTERN, UserProvider)
  // TODO.with(PATTERN, UserProvider)
  // TODO.with(PATTERN, UserProvider)
  .otherwise(() => {
    throw new Error("Unable to parse user")
  })

type NotAsked = { kind: "NotAsked" };
const NotAsked = (): NotAsked => ({ kind: "NotAsked" });

type InitialLoading = { kind: "InitialLoading" };
const InitialLoading = (): InitialLoading => ({ kind: "InitialLoading" });

type Loaded<T> = { kind: "Loaded"; data: T };
const Loaded = <T>(data: T): Loaded<T> => ({ kind: "Loaded", data });

type Loading<T> = { kind: "Loading"; data: T };
const Loading = <T>(data: T): Loading<T> => ({ kind: "Loading", data });

type Error_<E> = { kind: "Error"; error: E };
const Error_ = <E>(error: E): Error_<E> => ({ kind: "Error", error });

type RemoteData<T, E> = | NotAsked | InitialLoading | Loading<T> | Loaded<T> | Error_<E>;

const remoteData: RemoteData<string, string> = NotAsked()

const isSuccess = <T, E>(remoteData: RemoteData<T, E>) => remoteData.kind === "Loaded"

const tap = <T>(f: (a: T) => void) => (a: T) => {
  f(a)
  return a
}

const throw_ = <E>(e: E) => {
  throw e
}

const log = (...a: any[]): void => {
  if (false) {
    console.log(...a)
  }
}

const getUser = (username: string): Promise<RemoteData<GitHubUser, string>> => {
  return fetch(`https://api.github.com/users/${username}`)
    .then(tap(log))
    .then(response => response.status !== 200
      ? throw_(new Error(response.statusText))
      : response.json()
    )
    .then(tap(log))
    .then(parseUser)
    .then(Loaded)
    .then(tap(log))
    .catch(Error_)
}

(async () => {
  const x = await getUser("r17xXXXXX")
  const y = await getUser("r17x")

  console.log(
    "Run fetch user",
    { x, y }
  )
})()
