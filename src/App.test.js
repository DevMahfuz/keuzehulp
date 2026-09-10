import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { parseLaunchType } from "./config/embed";

async function renderApp() {
  const host = document.createElement("div");
  host.id = "beamer-keuzehulp";
  document.body.appendChild(host);
  const view = render(<App />, { container: host });
  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  return view;
}

beforeEach(() => {
  window.sessionStorage.clear();
  window.dataLayer = [];
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: async () => ({}),
  });
});

test("toont de homepage launcher met echte knoppen", async () => {
  await renderApp();
  expect(screen.getByTestId("bw-keuzehulp-launcher")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Welke beamer past bij jou/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Ik zoek een beamer/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Ik zoek een projectiescherm/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Ik wil een complete set/i })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Start de keuzehulp/i })).not.toBeInTheDocument();
  expect(screen.queryByText(/Waar kunnen we je mee helpen/i)).not.toBeInTheDocument();
});

test("beamer-CTA opent de wizard zonder categorievraag", async () => {
  await renderApp();
  fireEvent.click(screen.getByRole("button", { name: /Ik zoek een beamer/i }));
  expect(screen.getByTestId("bw-keuzehulp-overlay")).toBeInTheDocument();
  expect(screen.getByText(/Waar ga je de beamer vooral voor gebruiken/i)).toBeInTheDocument();
  expect(screen.queryByText(/Waar kunnen we je mee helpen/i)).not.toBeInTheDocument();
  expect(window.dataLayer.map((e) => e.event)).toEqual(
    expect.arrayContaining(["keuzehulp_banner_view", "keuzehulp_beamer_clicked", "keuzehulp_started"])
  );
});

test("screen- en set-CTA skippen de categorievraag", async () => {
  await renderApp();
  fireEvent.click(screen.getByRole("button", { name: /Ik zoek een projectiescherm/i }));
  expect(screen.getByText(/Waar komt het scherm/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Sluiten/i }));
  fireEvent.click(screen.getByRole("button", { name: /Ik wil een complete set/i }));
  expect(screen.queryByText(/Waar kunnen we je mee helpen/i)).not.toBeInTheDocument();
  expect(screen.getByTestId("bw-keuzehulp-overlay")).toBeInTheDocument();
});

test("sluiten bewaart antwoorden in sessionStorage", async () => {
  await renderApp();
  fireEvent.click(screen.getByRole("button", { name: /Ik zoek een beamer/i }));
  fireEvent.click(screen.getByRole("button", { name: /Films & series/i }));
  fireEvent.click(screen.getByRole("button", { name: /Sluiten/i }));
  expect(screen.queryByTestId("bw-keuzehulp-overlay")).not.toBeInTheDocument();
  const saved = JSON.parse(window.sessionStorage.getItem("keuzehulp:v1"));
  expect(saved.category).toBe("projector");
  expect(saved.answers.usage).toBe("movies");
  expect(saved.step).toBe("questions");
  fireEvent.click(screen.getByRole("button", { name: /Ik zoek een beamer/i }));
  expect(screen.getByText(/In welke ruimte ga je vooral kijken/i)).toBeInTheDocument();
});

test("parseLaunchType leest type=beamer/screen/set", () => {
  expect(parseLaunchType("?type=beamer")).toBe("beamer");
  expect(parseLaunchType("?keuzehulp=screen")).toBe("screen");
  expect(parseLaunchType("?type=set")).toBe("set");
  expect(parseLaunchType("")).toBe(null);
});
