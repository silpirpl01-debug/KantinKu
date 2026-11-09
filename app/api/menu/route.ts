import { Menu } from "../../../data/Menu";

export async function GET() {
  return Response.json(Menu);
}