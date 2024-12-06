#![feature(test)]
extern crate test;

use std::fs::read_to_string;

const EMPTY: u8 = 0;
const DIR_UP: u8 = 1;
const DIR_RIGHT: u8 = 2;
const DIR_DOWN: u8 = 4;
const DIR_LEFT: u8 = 8;
const OBSTACLE: u8 = 128;

enum TickStatus {
    Ok,
    OutOfBounds,
    InfiniteLoop,
}

fn main() {
    let input_raw = match read_to_string("inputs") {
        Ok(x) => x,
        Err(err) => return println!("Error reading file: {}", err),
    };
    let inputs = Input::parse(&input_raw);
    println!("Part 1 = {}", answer_part1(&inputs));
    println!("Part 2 = {}", answer_part2(&inputs));
}

fn answer_part1(inputs: &Input) -> usize {
    let mut grid = inputs.to_grid();
    while let TickStatus::Ok = grid.tick_part1() {}

    grid.cells
        .into_iter()
        .filter(|&x| x != EMPTY && x != OBSTACLE)
        .count()
}

fn answer_part2(inputs: &Input) -> usize {
    let coords = {
        let mut grid = inputs.to_grid();
        while let TickStatus::Ok = grid.tick_part2() {}

        let mut coords = Vec::new();
        for y in 0..grid.height {
            for x in 0..grid.width {
                let val = grid.get_cell((x, y)).unwrap();
                if val != EMPTY && val != OBSTACLE {
                    coords.push((x, y))
                }
            }
        }
        coords
    };

    let mut loop_count = 0;
    for obstacle_coord in coords {
        let mut grid = inputs.to_grid();
        grid.set_cell(obstacle_coord, OBSTACLE);

        loop {
            match grid.tick_part2() {
                TickStatus::Ok => {}
                TickStatus::InfiniteLoop => {
                    loop_count += 1;
                    break;
                }
                TickStatus::OutOfBounds => break,
            }
        }
    }
    loop_count
}

#[inline]
fn dir_add(cell_val: u8, dir: u8) -> u8 {
    cell_val | dir
}

#[inline]
fn dir_turn(v: u8) -> u8 {
    match v {
        DIR_UP => DIR_RIGHT,
        DIR_RIGHT => DIR_DOWN,
        DIR_DOWN => DIR_LEFT,
        DIR_LEFT => DIR_UP,
        _ => unreachable!(),
    }
}

#[derive(Debug)]
struct Input {
    start: (i32, i32),
    start_dir: u8,
    height: i32,
    width: i32,
    cells: Vec<u8>,
}

impl Input {
    pub fn parse(s: &str) -> Input {
        let mut width: usize = 0;
        let mut cells: Vec<u8> = Vec::with_capacity(s.len());
        let mut start_idx: usize = 0;
        let mut start_dir: u8 = 0;

        for ch in s.chars().into_iter() {
            match ch {
                '#' => {
                    cells.push(OBSTACLE);
                }
                '.' => {
                    cells.push(EMPTY);
                }
                '^' => {
                    start_idx = cells.len();
                    cells.push(DIR_UP);
                    start_dir = DIR_UP;
                }
                'v' => {
                    start_idx = cells.len();
                    cells.push(DIR_DOWN);
                    start_dir = DIR_DOWN;
                }
                '<' => {
                    start_idx = cells.len();
                    cells.push(DIR_LEFT);
                    start_dir = DIR_LEFT;
                }
                '>' => {
                    start_idx = cells.len();
                    cells.push(DIR_RIGHT);
                    start_dir = DIR_RIGHT;
                }
                '\n' if width == 0 => {
                    width = cells.len();
                }
                _ => {}
            }
        }

        let height = cells.len() / width;
        Input {
            start: ((start_idx % width) as i32, (start_idx / height) as i32),
            start_dir,
            width: width as i32,
            height: height as i32,
            cells,
        }
    }

    fn to_grid(&self) -> Grid {
        Grid {
            pos: self.start,
            dir: self.start_dir,
            width: self.width,
            height: self.height,
            cells: self.cells.clone(),
        }
    }
}

struct Grid {
    pos: (i32, i32),
    dir: u8,
    height: i32,
    width: i32,
    cells: Vec<u8>,
}

impl Grid {
    fn tick_part1(&mut self) -> TickStatus {
        let next_pos = match self.dir {
            DIR_UP => (self.pos.0, self.pos.1 - 1),
            DIR_RIGHT => (self.pos.0 + 1, self.pos.1),
            DIR_DOWN => (self.pos.0, self.pos.1 + 1),
            DIR_LEFT => (self.pos.0 - 1, self.pos.1),
            _ => unreachable!(),
        };

        let next_cell_val = match self.get_cell(next_pos) {
            None => return TickStatus::OutOfBounds,
            Some(x) => x,
        };
        if next_cell_val == OBSTACLE {
            let cur_cell_val = self.get_cell(self.pos).unwrap();
            let next_dir = dir_turn(self.dir);
            let cur_cell_next_val = dir_add(cur_cell_val, next_dir);
            self.dir = next_dir;
            self.set_cell(self.pos, cur_cell_next_val);
        } else {
            let next_cell_val = dir_add(next_cell_val, self.dir);
            self.pos = next_pos;
            self.set_cell(next_pos, next_cell_val);
        }
        return TickStatus::Ok;
    }

    fn tick_part2(&mut self) -> TickStatus {
        let next_pos = match self.dir {
            DIR_UP => (self.pos.0, self.pos.1 - 1),
            DIR_RIGHT => (self.pos.0 + 1, self.pos.1),
            DIR_DOWN => (self.pos.0, self.pos.1 + 1),
            DIR_LEFT => (self.pos.0 - 1, self.pos.1),
            _ => unreachable!(),
        };

        let next_cell_val = match self.get_cell(next_pos) {
            None => return TickStatus::OutOfBounds,
            Some(x) => x,
        };
        if next_cell_val == OBSTACLE {
            let cur_cell_val = self.get_cell(self.pos).unwrap();
            let next_dir = dir_turn(self.dir);
            let cur_cell_next_val = dir_add(cur_cell_val, next_dir);
            self.dir = next_dir;
            self.set_cell(self.pos, cur_cell_next_val);
            return TickStatus::Ok;
        }
        let next_cell_next_val = dir_add(next_cell_val, self.dir);
        if next_cell_next_val == next_cell_val {
            return TickStatus::InfiniteLoop;
        }
        self.pos = next_pos;
        self.set_cell(next_pos, next_cell_next_val);
        return TickStatus::Ok;
    }

    #[inline]
    fn get_cell(&self, (x, y): (i32, i32)) -> Option<u8> {
        if !(0..self.width).contains(&x) {
            return None;
        }
        self.cells.get((y * self.width + x) as usize).copied()
    }

    #[inline]
    fn set_cell(&mut self, (x, y): (i32, i32), val: u8) {
        self.cells[(y * self.width + x) as usize] = val;
    }

    #[allow(dead_code)]
    fn to_string(&self) -> String {
        let mut s = String::new();
        for y in 0..self.height {
            for x in 0..self.width {
                if (x, y) == self.pos {
                    s.push(match self.dir {
                        DIR_UP => '^',
                        DIR_RIGHT => '>',
                        DIR_DOWN => 'v',
                        DIR_LEFT => '<',
                        _ => unreachable!(),
                    })
                } else {
                    s.push(match self.get_cell((x, y)).unwrap() {
                        EMPTY => '.',
                        OBSTACLE => '#',
                        _ => 'X',
                    });
                }
            }
            s.push('\n');
        }
        s
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &'static str = "....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...";

    #[test]
    fn _part1() {
        let inputs = Input::parse(EXAMPLE_INPUT);
        assert_eq!(41, answer_part1(&inputs));
    }
    #[test]
    fn _part2() {
        let inputs = Input::parse(EXAMPLE_INPUT);
        assert_eq!(6, answer_part2(&inputs));
    }

    #[bench]
    fn bench_parse(b: &mut test::Bencher) {
        let input = include_str!("../inputs");
        b.iter(|| {
            test::black_box(Input::parse(input));
        });
    }

    #[bench]
    fn bench_answer_part1(b: &mut test::Bencher) {
        let inputs = Input::parse(include_str!("../inputs"));
        b.iter(|| {
            test::black_box(answer_part1(&inputs));
        });
    }

    #[bench]
    fn bench_answer_part2(b: &mut test::Bencher) {
        let inputs = Input::parse(include_str!("../inputs"));
        b.iter(|| {
            test::black_box(answer_part2(&inputs));
        });
    }
}
