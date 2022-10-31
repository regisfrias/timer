<script lang="ts">
  import '../global.css'
  import { onMount } from 'svelte';
  import { msToTime } from '../lib/utils'
  const colors = [
    '#e0053c',
    '#f25b36',
    '#e88d23',
    '#aca138',
    '#3e9853',
    '#178d84',
    '#3e9853',
    '#aca138',
    '#e88d23',
    '#f25b36',
  ]

  interface timerType {
    start: string
    diff: number
    name: string
    interval: number
  }

  interface timersType {
    [date: string]: {
      timers: timerType[] | []
      total: number
      date: Date
    }
  }

  let today: Date = new Date()
  let todaysKey = today.toISOString().substring(0, 10)
  let allTimers: timersType = {[todaysKey]: {
    timers: [],
    total: 0,
    date: today
  }}
  let interval = 0

  onMount(() => {
    if (localStorage.timers) {
      const timers = JSON.parse(localStorage.timers)
      if (Object.keys(timers).length) {
        allTimers = timers
      }
    }
  })

	const updateDate = (timerDate: string, timerId: number) => {
    const current = new Date()
    const timer = allTimers[timerDate].timers[timerId]
    const start = new Date(timer.start)
		const diff = (current.getTime() - start.getTime())
    const total = (allTimers[timerDate].timers as timerType[]).reduce((prev, timer) => prev + timer.diff, 0)
    allTimers[timerDate].timers[timerId] = {...timer, diff}
    allTimers[timerDate].total = total

    localStorage.setItem('timers', JSON.stringify(allTimers))
	}

  const startTimer = (evt: Event) => {
    const target = evt.target as HTMLInputElement
    const timerId = target.dataset.timerId ? parseInt(target.dataset.timerId) : 0
    const todaysKey = target.dataset.timerDay || ''
    const start = new Date()

    if (interval) {
      window.clearInterval(interval);
    }
    interval = window.setInterval(() => updateDate(todaysKey, timerId), 1000)

    const newTimer = {
      start: start.toISOString(),
      diff: 0,
      name: '',
      interval,
    }

    if (allTimers[todaysKey].timers.length === timerId) {
      allTimers[todaysKey] = {
        ...allTimers[todaysKey],
        timers: [
          ...allTimers[todaysKey].timers,
          newTimer
        ]
      }
    } else {
      const newStart = new Date(start.getTime() - allTimers[todaysKey].timers[timerId].diff)
      allTimers[todaysKey].timers.splice(timerId, 1, {
        start: newStart.toISOString(),
        diff: allTimers[todaysKey].timers[timerId].diff,
        name: allTimers[todaysKey].timers[timerId].name,
        interval,
      })
    }
    
    updateDate(todaysKey, timerId)
  }

  const onNameChange = () => localStorage.setItem(`timers`, `${JSON.stringify(allTimers)}`)

  const removeAll = () => {
    localStorage.clear()
    allTimers = {}
  }

  const stopTimer = () => {
    window.clearInterval(interval)
    interval = 0
  }
</script>

<main>
  <h1>Simple Timer</h1>

  {#if allTimers && Object.keys(allTimers).length}
    <article class="allTimers">
      {#each Object.keys(allTimers) as thisDay}
        {#if todaysKey === thisDay }
          <h2>Today</h2>
        {/if}
        {#each allTimers[thisDay].timers as timer, id}
          <div style={`border-left: 2px solid ${colors[id % colors.length]}`} class="timer {interval === timer.interval ? 'current' : ''}">
            <input class="timer-name" data-timer-id={id} data-timer-day={thisDay} type="text" name="" id="" bind:value={timer.name} on:keyup={onNameChange} placeholder="Timer name" />
            <div class="time">
              {msToTime(timer.diff)}
            </div>
            {#if interval === timer.interval}
              <button class="play_pause active" data-timer-id={id} on:click={stopTimer}>■</button>
            {:else}
              <button class="play_pause" data-timer-id={id} data-timer-day={thisDay} on:click={startTimer}>►</button>
            {/if}
          </div>
        {/each}
      {/each}
    </article>
  {/if}
</main>

<footer class="footer">
  <button on:click={startTimer} data-timer-id={allTimers[todaysKey] && allTimers[todaysKey].timers ? Object.keys(allTimers[todaysKey].timers).length : 0} data-timer-day={todaysKey}>Start new timer</button>
  <button on:click={removeAll}>Delete all</button>
</footer>

<style>
  h1 {
    text-align: center;
  }

  .allTimers {
    max-width: 100%;
  }

  .timer {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    border-bottom: 1px solid #00000024;
  }

  .timer.current {
    background-color: #00000024;
  }

  .timer-name {
    max-width: 34%;
  }

  .timer input {
    display: block;
    min-height: 1.6rem;
    line-height: 1;
    margin: 0;
    padding: 0.5rem;
    border: 1px solid transparent;
    background-color: transparent;
    color: white;
  }

  .timer input:focus {
    outline: 0;
    background-color: rgba(255, 255, 255, 0.05);
  }

  .time {
    display: flex;
    align-items: center;
    margin: 0 var(--padding_sm);
    flex-grow: 1;
  }

  .play_pause {
    font-size: 1rem;
    width: 3rem;
  }

  .footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: var(--padding);
    align-items: stretch;
    background-color: var(--background);
    position: fixed;
    bottom: 0;
    width: calc(100% - var(--padding) * 2);
    padding: var(--padding_sm) var(--padding);
    box-shadow: 1px -1px 24px 0px rgba(0,0,0,0.2);
    -webkit-box-shadow: 1px -1px 24px 0px rgba(0,0,0,0.2);
    -moz-box-shadow: 1px -1px 24px 0px rgba(0,0,0,0.2);
  }

</style>
